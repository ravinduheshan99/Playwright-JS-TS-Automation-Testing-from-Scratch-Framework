const { test, expect } = require('@playwright/test');

let webContext;

test.beforeAll(async({browser})=>{
    //Create a fresh, isolated browser context for this test run (clean cookies/localStorage/session).
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/client/auth/login');
    console.log(await page.title());
    await page.locator('#userEmail').fill("test@gmail.com");
    await page.locator('#userPassword').fill("test@123");
    await page.locator("[value='Login']").click();
    //Wait for SPA/API calls to settle after login so product cards render before interacting.
    await page.waitForLoadState('networkidle');
    //Persist authenticated cookies/localStorage so other tests can reuse the same signed-in state without logging in again.
    await context.storageState({path: 'state.json'});
    //Create a shared authenticated context from the saved storageState to speed up multiple tests in this file.
    webContext = await browser.newContext({storageState:'state.json'});
});

test('@API Client App End to End Automation Scenario', async()=>{
     //Create a new page per test while reusing the authenticated context to keep test runs isolated.
     const page = await webContext.newPage();

    //Test data kept as constants so the flow can be updated by changing a single value.
    const productName = "ZARA COAT 3";
    const loginEmail = "test@gmail.com";
    const products = page.locator(".card-body");

    await page.goto('https://rahulshettyacademy.com/client/');
    //Ensures product cards are attached/visible before reading or counting.
    await products.last().waitFor();
    console.log(await products.allTextContents());

    const count = await products.count();

    for(let i=0; i<count; ++i){
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

    const isProductVisible = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
    expect(isProductVisible).toBeTruthy();

    await page.locator("text=Checkout").click();

    //Not using fill() method as we need to type sequentially without pasting the text directly in the text field. 
    //delay simulates real typing to trigger autocomplete/search API in country dropdown.
    await page.locator("[placeholder*='Country']").pressSequentially("Sr",{delay:150});

    const countryOptions = await page.locator(".ta-results");
    await countryOptions.waitFor();

    const countryOptionsCount = await countryOptions.locator("button").count();

    for(let i=0; i<countryOptionsCount; ++i){
        const countryName = await countryOptions.locator("button").nth(i).textContent();
        if(countryName.trim() === "Sri Lanka"){
            await countryOptions.locator("button").nth(i).click();
            break;
        }
    }

    //Verify the logged-in user email shown on checkout matches the test user.
    expect(await page.locator(".user__name [type='text']").first()).toHaveText(loginEmail);

    await page.locator(".action__submit").click();

    expect(await page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");

    //Capture the generated order id so we can validate it later in "My Orders".
    const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    console.log(orderId);

    await page.locator("button[routerlink*='myorders']").click();

    //Wait for table body to render before querying rows (avoids count=0 race).
    await page.locator("tbody").waitFor();

    const tableRows = await page.locator("tbody tr");

    for(let i=0; i<await tableRows.count(); ++i){
        const rowOrderId = await tableRows.nth(i).locator("th").textContent();

        //Some UIs show partial ids, so we use includes() instead of strict equality.
        if(await orderId.includes(rowOrderId)){
            //Clicking the first button in the row typically opens the order details view.
            await tableRows.nth(i).locator("button").first().click();
            break;
        }
    }

    const orderDetails = await page.locator(".col-text").textContent();
    expect(orderId.includes(orderDetails)).toBeTruthy();

});

test('@API Client App End to End Automation Scenario 2', async()=>{
     //Reuse the authenticated context while starting with a fresh page for this test.
     const page = await webContext.newPage();

    //Test data kept as constants so the flow can be updated by changing a single value.
    const productName = "ZARA COAT 3";
    const loginEmail = "test@gmail.com";
    const products = page.locator(".card-body");

    await page.goto('https://rahulshettyacademy.com/client/');
    //Ensures product cards are attached/visible before reading or counting.
    await products.last().waitFor();
    console.log(await products.allTextContents());
});
