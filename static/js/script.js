// Function to save search history to localStorage
function saveToHistory(ip, country, region, city, latitude, longitude) {
    let history = JSON.parse(localStorage.getItem('history')) || [];
    
    // Create a new entry for the search
    let newEntry = {
        ip: ip,
        country: country,
        region: region,
        city: city,
        latitude: latitude,
        longitude: longitude,
        timestamp: new Date().toLocaleString() // Timestamp of the search
    };

    // Add the new entry to the history
    history.push(newEntry);

    // Save updated history to localStorage
    localStorage.setItem('history', JSON.stringify(history));

    // Display updated history
    displayHistory();
}

// Function to display history from localStorage
function displayHistory() {
    let history = JSON.parse(localStorage.getItem('history')) || [];
    let historyList = document.getElementById('history-list');
    
    historyList.innerHTML = '';  // Clear the history section before displaying

    // Loop through history and display each entry
    history.forEach(entry => {
        let entryElement = document.createElement('div');
        entryElement.classList.add('history-entry');
        entryElement.innerHTML = `
            <strong>IP:</strong> ${entry.ip} <br>
            <strong>Location:</strong> ${entry.city}, ${entry.region}, ${entry.country} <br>
            <small>${entry.timestamp}</small>
        `;
        historyList.appendChild(entryElement);
    });
}

// Function to fetch and display geolocation data
function fetchGeoData(ip) {
    fetch('/get_geo_data', {
        method: 'POST',
        body: new URLSearchParams({ ip: ip }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            const { ip, country, region, city, latitude, longitude } = data;
            displayGeoData(ip, country, region, city, latitude, longitude); // Display geolocation data
            saveToHistory(ip, country, region, city, latitude, longitude); // Save this search to history
        }
    })
    .catch(error => {
        console.error('Error fetching IP data:', error);
        alert('Error fetching IP data.');
    });
}

// Function to display geolocation data on the page
function displayGeoData(ip, country, region, city, latitude, longitude) {
    document.getElementById('ip-address').textContent = `IP Address: ${ip}`;
    document.getElementById('country').textContent = `Country: ${country}`;
    document.getElementById('region').textContent = `Region: ${region}`;
    document.getElementById('city').textContent = `City: ${city}`;
    document.getElementById('latitude').textContent = `Latitude: ${latitude}`;
    document.getElementById('longitude').textContent = `Longitude: ${longitude}`;
}

// Event listener for search button
document.getElementById('search-btn').addEventListener('click', () => {
    let ip = document.getElementById('ip-input').value;
    if (ip) {
        fetchGeoData(ip);
    } else {
        alert('Please enter a valid IP address.');
    }
});

// Call displayHistory() on page load to show past searches
window.onload = displayHistory;
