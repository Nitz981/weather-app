document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('search-btn');
    const locationInput = document.getElementById('location-input');
    const weatherInfo = document.querySelector('.weather-info');
    const loading = document.querySelector('.loading');
    const errorElement = document.querySelector('.error');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Load weather for default location (London) on page load
    fetchWeather('London');
    
    searchBtn.addEventListener('click', function() {
        const location = locationInput.value.trim();
        if (location) {
            fetchWeather(location);
        }
    });
    
    locationInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const location = locationInput.value.trim();
            if (location) {
                fetchWeather(location);
            }
        }
    });
    
    // Theme toggle functionality
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            setNightMode();
        } else {
            setDayMode();
        }
    });
    
    function fetchWeather(location) {
        // Show loading, hide weather info and error
        loading.style.display = 'block';
        weatherInfo.style.display = 'none';
        errorElement.style.display = 'none';
        
        // Use HTTPS to avoid mixed content issues
        const apiUrl = `https://api.weatherapi.com/v1/current.json?key=1394ec04a14e402687c80752251707&q=${encodeURIComponent(location)}&aqi=yes`;
        
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Location not found or API error');
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    throw new Error(data.error.message);
                }
                displayWeather(data);
                // Set day/night mode based on API response
                if (data.current.is_day === 0) {
                    setNightMode();
                    themeToggle.checked = true;
                } else {
                    setDayMode();
                    themeToggle.checked = false;
                }
            })
            .catch(error => {
                showError(error.message);
                console.error('Error fetching weather:', error);
            });
    }
    
    function displayWeather(data) {
        // Hide loading, show weather info
        loading.style.display = 'none';
        weatherInfo.style.display = 'block';
        
        // Format local time
        const localTime = new Date(data.location.localtime);
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        const formattedTime = localTime.toLocaleString('en-US', options);
        
        // Update the UI with weather data
        document.getElementById('location-name').textContent = `${data.location.name}, ${data.location.country}`;
        document.getElementById('local-time').textContent = `Local Time: ${formattedTime}`;
        document.getElementById('temperature').textContent = data.current.temp_c;
        document.getElementById('feels-like').textContent = data.current.feelslike_c;
        document.getElementById('humidity').textContent = data.current.humidity;
        document.getElementById('wind-speed').textContent = data.current.wind_kph;
        document.getElementById('pressure').textContent = data.current.pressure_mb;
        document.getElementById('visibility').textContent = data.current.vis_km;
        document.getElementById('uv').textContent = data.current.uv;
        document.getElementById('weather-text').textContent = data.current.condition.text;
        document.getElementById('weather-icon').src = `https:${data.current.condition.icon}`;
        document.getElementById('day-night').textContent = data.current.is_day ? 'Day' : 'Night';
    }
    
    function showError(message) {
        loading.style.display = 'none';
        weatherInfo.style.display = 'none';
        errorElement.style.display = 'block';
        errorElement.textContent = `Error: ${message}`;
    }
    
    function setDayMode() {
        body.classList.remove('night-mode');
        body.classList.add('day-mode');
    }
    
    function setNightMode() {
        body.classList.remove('day-mode');
        body.classList.add('night-mode');
    }
});