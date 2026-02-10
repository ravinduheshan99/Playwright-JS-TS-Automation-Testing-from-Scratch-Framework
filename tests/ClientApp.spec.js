const { test, expect } = require('@playwright/test');

//To run a single test file : npx playwright test tests/ClientApp.spec.js 

test('Client App End to End Automation Scenario', async({browser})=>{
    //Create a fresh, isolated browser context for this test run (clean cookies/localStorage/session).
    const context = await browser.newContext();
    const page = await context.newPage();

    //Keep locators in variables to avoid repeating selectors and to improve readability/maintenance.
    const un = page.locator('#userEmail');
    const pw = page.locator('#userPassword');
    const login = page.locator("[value='Login']");
    const products = page.locator(".card-body");

    //Test data kept as constants so the flow can be updated by changing a single value.
    const productName = "ZARA COAT 3";
    const loginEmail = "test@gmail.com";

    await page.goto('https://rahulshettyacademy.com/client/auth/login');
    console.log(await page.title());

    await un.fill(loginEmail);
    await pw.fill("test@123");
    await login.click();

    //Wait for SPA/API calls to settle after login so product cards render before interacting.
    await page.waitForLoadState('networkidle');

    //Ensures at least one product card is attached/visible before reading or counting.
    await products.last().waitFor();

    console.log(await products.allTextContents());

    //Capture count once to avoid re-evaluating the locator on every loop iteration.
    const count = await products.count();

    for(let i=0; i<count; ++i){
        //Read the product title from each card and match the target item.
        if(await products.nth(i).locator("b").textContent() === productName){
            //Using text locator inside the card ensures we click the correct card's button.
            await products.nth(i).locator("text= Add To Cart").click();
            break; //Stop looping once the correct product is added.
        }
    }

    //routerlink selector is stable for Angular routes and avoids brittle CSS/XPath.
    await page.locator("[routerlink*='cart']").click();

    //using this as isVisible() is not supported for auto wait in line 53
    //Wait for cart line items to appear to avoid checking visibility before DOM updates.
    await page.locator("div li").last().waitFor();

    //Explicit visibility check for assertion readability (could also assert locator directly).
    const isProductVisible = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
    expect(isProductVisible).toBeTruthy();

    await page.locator("text=Checkout").click();

    //Not using fill() method as we need to type sequentially without pasting the text directly in the text field. 
    //delay simulates real typing to trigger autocomplete/search API in country dropdown.
    await page.locator("[placeholder*='Country']").pressSequentially("Sr",{delay:150});

    const countryOptions = await page.locator(".ta-results");
    //Wait until the suggestion container is rendered before counting/clicking options.
    await countryOptions.waitFor();

    //Counting buttons within the results ensures we iterate only over selectable options.
    const countryOptionsCount = await countryOptions.locator("button").count();

    for(let i=0; i<countryOptionsCount; ++i){
        //Trim text because suggestion labels often include extra whitespace/newlines.
        const countryName = await countryOptions.locator("button").nth(i).textContent();
        if(countryName.trim() === "Sri Lanka"){
            await countryOptions.locator("button").nth(i).click();
            break; //Stop once the intended country is selected.
        }
    }

    //Verify the logged-in user email shown on checkout matches the test user.
    expect(await page.locator(".user__name [type='text']").first()).toHaveText(loginEmail);

    await page.locator(".action__submit").click();

    //Confirms order placement success page is loaded and message is correct.
    expect(await page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");

    //Capture the generated order id so we can validate it later in "My Orders".
    const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    console.log(orderId);

    await page.locator("button[routerlink*='myorders']").click();

    //Wait for table body to render before querying rows (avoids count=0 race).
    await page.locator("tbody").waitFor();

    const tableRows = await page.locator("tbody tr");

    for(let i=0; i<await tableRows.count(); ++i){
        //Row header contains the order id shown in the list view.
        const rowOrderId = await tableRows.nth(i).locator("th").textContent();

        //Some UIs show partial ids, so we use includes() instead of strict equality.
        if(await orderId.includes(rowOrderId)){
            //Clicking the first button in the row typically opens the order details view.
            await tableRows.nth(i).locator("button").first().click();
            break;
        }
    }

    //Validate that order details page shows the same order reference as the confirmation.
    const orderDetails = await page.locator(".col-text").textContent();
    expect(orderId.includes(orderDetails)).toBeTruthy();

});
