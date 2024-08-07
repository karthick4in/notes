import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const generateExcelWithExcelJS = async () => {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Define columns
    worksheet.columns = [
        { header: 'Name', key: 'name', width: 10 },
        { header: 'Age', key: 'age', width: 10 },
        { header: 'City', key: 'city', width: 10 }
    ];

    // Add data
    worksheet.addRow(['Alice', 30, 'New York']);
    worksheet.addRow(['Bob', 25, 'Los Angeles']);

    // Apply style to the header row
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell(cell => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF0000' } // Red background color
        };
        cell.font = {
            color: { argb: 'FFFFFFFF' }, // White text color
            bold: true
        };
    });

    // Write to buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Save file
    saveAs(new Blob([buffer]), 'example_with_exceljs.xlsx');
};

// Example usage in a React component
const App = () => {
    return (
        <div>
            <button onClick={generateExcelWithExcelJS}>Generate Excel with ExcelJS</button>
        </div>
    );
};

export default App;
 import * as XLSX from 'xlsx';

const generateExcel = () => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Create a worksheet with some data
    const data = [
        ["Name", "Age", "City"],
        ["Alice", 30, "New York"],
        ["Bob", 25, "Los Angeles"]
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // Define cell fill style
    const cellStyle = {
        fill: {
            patternType: "solid",
            fgColor: { rgb: "FFFF0000" } // Red background color
        }
    };

    // Apply the style to a specific cell
    worksheet['A1'].s = cellStyle;
    worksheet['B1'].s = cellStyle;
    worksheet['C1'].s = cellStyle;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Write the workbook to a file (or generate a download in a browser)
    XLSX.writeFile(workbook, "example.xlsx");
};

// Example usage in a React component
const App = () => {
    return (
        <div>
            <button onClick={generateExcel}>Generate Excel</button>
        </div>
    );
};

export default App;
 

const XLSX = require('xlsx-style');

// Create a new workbook
const workbook = {
    SheetNames: [],
    Sheets: {}
};

// Create a new worksheet
const worksheet = {};

// Add data to the worksheet
worksheet['A1'] = { v: 'Hello', t: 's', s: {
    fill: {
        patternType: 'solid',
        fgColor: { rgb: 'FFFF00' }, // Yellow fill
        bgColor: { rgb: 'FF0000' }  // Red background
    }
}};

// Add the worksheet to the workbook
workbook.SheetNames.push('Sheet1');
workbook.Sheets['Sheet1'] = worksheet;

// Write the workbook to a file
XLSX.writeFile(workbook, 'styled.xlsx');


import React from 'react';
import XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const App = () => {
    const generateExcel = () => {
        // Create a new workbook and a worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet([
            ["Name", "Age", "City"],
            ["Alice", 30, "New York"],
            ["Bob", 25, "Los Angeles"],
            ["Charlie", 35, "Chicago"]
        ]);

        // Set the color of the second column (B) to red
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for(let row = range.s.r + 1; row <= range.e.r; row++) { // skip the header row
            const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: 1 })]; // column B is index 1
            if(cell) {
                if(!cell.s) cell.s = {}; // initialize the style object if it doesn't exist
                cell.s.fill = {
                    fgColor: { rgb: "FF0000" }
                };
            }
        }

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Write the workbook and trigger download
        const workbookOut = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([workbookOut], { type: "application/octet-stream" }), 'colored_column.xlsx');
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <button onClick={generateExcel}>Generate and Download Excel</button>
        </div>
    );
};

export default App;
