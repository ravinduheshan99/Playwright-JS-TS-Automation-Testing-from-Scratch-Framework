const ExcelJs = require('exceljs');

//method 01
// const workbook = new ExcelJs.Workbook();
// workbook.xlsx.readFile("D:/Ravindu Haputhanthri/My Documents/Career/My Projects/Playwright_Automation/excel_files/excelDownloadTest.xlsx").then(function () {
//     const worksheet = workbook.getWorksheet('Sheet1');
//     worksheet.eachRow((row, rowNumber) => {
//         row.eachCell((cell, colNumber) => {
//             console.log(cell.value);
//         })
//     })
// })

//method 02
async function writeExcelTest(searchText, replaceText, priceChange, sheetName, filePath) {
    const workbook = new ExcelJs.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = await workbook.getWorksheet(sheetName);
    const output = await readExcelTest(worksheet, searchText);
    const appleCell = await worksheet.getCell(output.rowNumApple, output.colNumApple);
    appleCell.value = replaceText;
    priceChange.rowPriceChange =  output.rowNumApple;
    priceChange.colPriceChange = output.colNumApple+2;
    const applePriceCell = await worksheet.getCell(priceChange.rowPriceChange, priceChange.colPriceChange);
    applePriceCell.value = priceChange.newPrice;
    await workbook.xlsx.writeFile(filePath);
}

async function readExcelTest(worksheet, searchText) {
    let output = { rowNumApple: -1, colNumApple: -1 };
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


writeExcelTest("Apple", "IPhone",{rowPriceChange:-1,colPriceChange:-1,newPrice:500}, "Sheet1", "D:/Ravindu Haputhanthri/My Documents/Career/My Projects/Playwright_Automation/excel_files/excelDownloadTest.xlsx");








