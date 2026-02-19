const { test, expect } = require('@playwright/test');
const ExcelJs = require('exceljs');

async function writeExcelTest(searchText, replaceText, priceChange, sheetName, filePath) {
    const workbook = new ExcelJs.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = await workbook.getWorksheet(sheetName);

    // Reuse the read helper to locate the exact row/column of the target text instead of hardcoding cell positions.
    const output = await readExcelTest(worksheet, searchText);

    const appleCell = await worksheet.getCell(output.rowNumApple, output.colNumApple);
    appleCell.value = replaceText;

    // The price cell is offset from the product name column, so we calculate it dynamically.
    priceChange.rowPriceChange = output.rowNumApple;
    priceChange.colPriceChange = output.colNumApple + 2;

    const applePriceCell = await worksheet.getCell(priceChange.rowPriceChange, priceChange.colPriceChange);
    applePriceCell.value = priceChange.newPrice;

    await workbook.xlsx.writeFile(filePath);
}

async function readExcelTest(worksheet, searchText) {
    let output = { rowNumApple: -1, colNumApple: -1 };

    // Scan the whole sheet to find the cell containing the target text (works even if the sheet layout changes).
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
            if (cell.value === searchText) {
                output.rowNumApple = rowNumber;
                output.colNumApple = colNumber;
                console.log("Row Number of Apple is: " + output.rowNumApple + " and Column Number of Apple is: " + output.colNumApple);
            }
        })
    })
    return output;
}

test('Upload Download Excel Validation', async ({ page }) => {
    const textSearch = 'Apple';
    const newText = 'IPhone';
    const excelSheetName = 'Sheet1';
    const excelFilePath = 'C:/Users/Dell/Downloads/download.xlsx';
    const updatedPriceValue = '500';

    await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html");

    // Use Promise.all so the download listener is registered before clicking the Download button (prevents missing the event).
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.getByRole("button", { name: 'Download' }).click(),
    ]);

    await download.saveAs(excelFilePath);

    await writeExcelTest(
        textSearch,
        newText,
        { rowPriceChange: -1, colPriceChange: -1, newPrice: updatedPriceValue },
        excelSheetName,
        excelFilePath
    );

    // Upload the updated Excel and validate that UI reflects the modified text and price.
    await page.locator("#fileinput").click();
    await page.locator("#fileinput").setInputFiles(excelFilePath);

    const textLocator = await page.getByText(newText);
    const desiredRow = await page.getByRole("row").filter({ has: textLocator });

    // Validate the expected price appears in the correct row after the upload.
    expect(await desiredRow.locator("#cell-4-undefined")).toContainText(updatedPriceValue);
});
