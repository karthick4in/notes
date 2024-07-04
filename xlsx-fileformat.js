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
