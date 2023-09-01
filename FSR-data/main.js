require('dotenv').config();
const monthNames = [
    '', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const Airtable = require('airtable');
const apiKey = process.env.API_KEY;  // Fetch the API key from environment variables
const baseId = 'appW8YUaabzGoy0Vq';
const base = new Airtable({ apiKey }).base(baseId);
const table = 'Table 1';

// Fetch data from Airtable and concatenate records
let allRecords = [];

base(table).select({}).eachPage((records, fetchNextPage) => {
    allRecords = allRecords.concat(records);
    fetchNextPage();
}, (err) => {
    if (err) {
        console.error(err);
        return;
    }

// Dynamically generate and display monthly reports in the DOM
    const yearSections = groupRecordsByYearAndMonth(allRecords);
    const monthSectionContainer = document.getElementById('month-sections');

    for (const year in yearSections) {
        if (yearSections.hasOwnProperty(year)) {
            const yearSection = document.createElement('div');
            yearSection.className = 'year-section';
            yearSection.innerHTML = `<h2>${year}</h2>`;
            
            for (const month in yearSections[year]) {
                if (yearSections[year].hasOwnProperty(month)) {
                    const monthName = monthNames[parseInt(month)];
                    const monthSection = document.createElement('div');
                    monthSection.className = 'month-section';
                    monthSection.innerHTML = `<h3>${monthName}</h3>`;
                    
                    const monthTable = document.createElement('table');
                    monthTable.innerHTML = `
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Hours</th>
                                <th>Return Visit</th>
                                <th>Bible Study</th>
                                <th>Videos</th>
                                <th>Placement</th>
                                <th>Contacts</th>
                                <th>Months</th>
                                <th>Month Name</th>
                                <th>Year</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Data will be populated here -->
                        </tbody>
                    `;
              // Populate Monthly Report Table:
                    yearSections[year][month].forEach(record => {
                        const fields = record.fields;
                        const rowData = ['Date', 'Hours', 'Return Visits', 'Bible Studies', 'Videos','Placements', 'Contacts', 'Month', 'MonthName', 'Year'].map(field => fields[field] || '0');
                        const row = `<tr>${rowData.map(cell => `<td>${cell}</td>`).join('')}</tr>`;
                        monthTable.querySelector('tbody').innerHTML += row;
                    });
                    
                    monthSection.appendChild(monthTable);
                    yearSection.appendChild(monthSection);
                }
            }
            
            monthSectionContainer.appendChild(yearSection);
        }
    }
});

// Group records by year and month
// This function takes an array of records and organizes them into a nested structure
// where records are grouped by year and month, facilitating data analysis and display.
function groupRecordsByYearAndMonth(records) {
    const yearMonthSections = {};

    records.forEach(record => {
        const year = record.fields['Year'];
        
        if (!yearMonthSections[year]) {
            yearMonthSections[year] = {};
        }
        
        const month = record.fields['Month'];
        yearMonthSections[year][month] = yearMonthSections[year][month] || [];
        yearMonthSections[year][month].push(record);
    });

    return yearMonthSections;
}