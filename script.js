// Create animated particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Random size between 5 and 20px
        const size = Math.random() * 15 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;

        // Random animation duration between 10 and 20 seconds
        const duration = Math.random() * 10 + 15;
        particle.style.animationDuration = `${duration}s`;

        // Random delay
        particle.style.animationDelay = `${Math.random() * 5}s`;

        particlesContainer.appendChild(particle);
    }
}

// Update date and time
function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('date-time').textContent = `${dateString} | ${timeString}`;
}

// Get weather data from OpenWeather API
async function getWeatherData(city) {
    // In a real implementation, you would use your API key here
    // const apiKey = 'YOUR_API_KEY';
    // const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    // For demo purposes, we'll use mock data
    return new Promise((resolve) => {
        setTimeout(() => {
            const mockData = {
                name: city,
                main: {
                    temp: Math.floor(Math.random() * 30) + 10,
                    feels_like: Math.floor(Math.random() * 30) + 10,
                    humidity: Math.floor(Math.random() * 50) + 30,
                    pressure: Math.floor(Math.random() * 100) + 1000
                },
                weather: [{
                    main: ['Clear', 'Clouds', 'Rain', 'Snow'][Math.floor(Math.random() * 4)],
                    description: ['Sunny', 'Partly cloudy', 'Light rain', 'Snow showers'][Math.floor(Math.random() * 4)]
                }],
                wind: {
                    speed: (Math.random() * 10).toFixed(1),
                    deg: Math.floor(Math.random() * 360)
                },
                visibility: (Math.random() * 10 + 5).toFixed(1),
                clouds: {
                    all: Math.floor(Math.random() * 100)
                }
            };
            resolve(mockData);
        }, 800);
    });
}

// Update UI with weather data
function updateWeatherUI(data) {
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('wind-speed').textContent = `${data.wind.speed} m/s`;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('feels-like').textContent = `${Math.round(data.main.feels_like)}°C`;
    document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
    document.getElementById('visibility').textContent = `${data.visibility} km`;
    document.getElementById('cloudiness').textContent = `${data.clouds.all}%`;
    document.getElementById('uv-index').textContent = Math.floor(Math.random() * 10) + 1;

    // Convert wind degree to direction
    const windDeg = data.wind.deg;
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(windDeg / 45) % 8;
    document.getElementById('wind-direction').textContent = directions[index];

    // Update weather icon based on condition
    const weatherIcon = document.getElementById('weather-icon');
    const condition = data.weather[0].main.toLowerCase();

    if (condition.includes('clear')) {
        weatherIcon.className = 'fas fa-sun';
    } else if (condition.includes('cloud')) {
        weatherIcon.className = 'fas fa-cloud';
    } else if (condition.includes('rain')) {
        weatherIcon.className = 'fas fa-cloud-rain';
    } else if (condition.includes('snow')) {
        weatherIcon.className = 'fas fa-snowflake';
    } else if (condition.includes('thunderstorm')) {
        weatherIcon.className = 'fas fa-bolt';
    } else if (condition.includes('drizzle')) {
        weatherIcon.className = 'fas fa-cloud-drizzle';
    } else {
        weatherIcon.className = 'fas fa-cloud';
    }

    // Generate forecast
    generateForecast();
}

// Generate mock forecast data
function generateForecast() {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const icons = ['fa-sun', 'fa-cloud', 'fa-cloud-rain', 'fa-cloud-sun', 'fa-snowflake'];
    const descriptions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Snow'];

    for (let i = 1; i <= 5; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dayName = days[date.getDay()];

        const randomTemp = Math.floor(Math.random() * 15) + 15; // 15-30°C
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
                    <div class="forecast-day">${dayName}</div>
                    <div class="forecast-icon"><i class="fas ${randomIcon}"></i></div>
                    <div class="forecast-temp">${randomTemp}°C</div>
                    <div class="forecast-desc">${randomDesc}</div>
                `;

        forecastContainer.appendChild(forecastItem);
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function () {
    createParticles();
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update time every minute

    // Set default city
    getWeatherData('New York').then(data => {
        updateWeatherUI(data);
    });

    // Search functionality
    document.getElementById('search-btn').addEventListener('click', function () {
        const city = document.getElementById('city-input').value.trim();
        if (city) {
            getWeatherData(city).then(data => {
                updateWeatherUI(data);
            });
        }
    });

    // Allow Enter key to trigger search
    document.getElementById('city-input').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            document.getElementById('search-btn').click();
        }
    });

    // Recent search tags functionality
    document.querySelectorAll('.search-tag').forEach(tag => {
        tag.addEventListener('click', function () {
            const city = this.textContent;
            document.getElementById('city-input').value = city;
            getWeatherData(city).then(data => {
                updateWeatherUI(data);
            });
        });
    });
});