const monthNames = [
    '', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];


const apiUrl = 'http://localhost:4000/airtable-data'; // Update with your server URL

// Function to fetch data from the server
async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data from server:', error);
    throw error;
  }
}


function displayData(data) {
    const allRecords = data.records;
  
    // The rest of your code for processing and displaying the data remains the same
    const yearSections = groupRecordsByYearAndMonth(allRecords);
    const monthSectionContainer = document.getElementById('month-sections');

// Dynamically generate and display monthly reports in the DOM
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
};

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

// Entry point: Fetch data from the server and display it
async function main() {
    try {
      const data = await fetchData();
      displayData(data);
    } catch (error) {
      // Handle errors here
      console.error('An error occurred:', error);
    }
  }
  
  // Call the main function to start the process
  main();