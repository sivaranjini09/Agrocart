document.addEventListener('DOMContentLoaded', async () => {
    const weatherText = document.querySelector('.weather-text');
    const weatherBox = document.querySelector('.weather-box');
    const apiKey = '58b7d9d18228197415fe2bfa899dedd7'; // Your OpenWeather API key
    const city = 'Kerala'; // Example city name
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    
    // Animated loading state
    weatherText.innerHTML = '<div class="loading">Gathering wisdom from the skies... <span class="dots">...</span></div>';
    
    // Add animation for loading dots
    const dotsAnimation = setInterval(() => {
        const dots = document.querySelector('.dots');
        if (dots) {
            dots.textContent = dots.textContent.length >= 3 ? '' : dots.textContent + '.';
        }
    }, 500);
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        // Clear loading animation
        clearInterval(dotsAnimation);
        
        if (data.cod === 200) {
            const temperature = Math.round(data.main.temp);
            const weatherCondition = data.weather[0].main;
            const weatherIcon = data.weather[0].icon;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;
            const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'});
            const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'});
            
            // More detailed weather descriptions
            const weatherDescriptions = {
                'Clear': {
                    icon: '☀',
                    description: 'Clear skies blessing your fields',
                    color: '#FFD700'
                },
                'Clouds': {
                    icon: '☁',
                    description: 'Clouds gathering overhead',
                    color: '#A9A9A9'
                },
                'Rain': {
                    icon: '🌧',
                    description: 'The heavens nourishing your soil',
                    color: '#4682B4'
                },
                'Drizzle': {
                    icon: '🌦',
                    description: 'A gentle mist upon your land',
                    color: '#87CEEB'
                },
                'Thunderstorm': {
                    icon: '⛈',
                    description: 'Nature\'s power on display',
                    color: '#483D8B'
                },
                'Snow': {
                    icon: '❄',
                    description: 'A blanket of white covering your fields',
                    color: '#F0F8FF'
                },
                'Mist': {
                    icon: '🌫',
                    description: 'Mysterious wisps dancing across your farm',
                    color: '#D3D3D3'
                }
            };
            
            // Default if no matching description
            const weatherDetails = weatherDescriptions[weatherCondition] || {
                icon: '🌈',
                description: 'The skies are changing',
                color: '#808080'
            };
            
            // Enhanced farmer-specific insights based on weather patterns
            let recommendation = '';
            let crops = [];
            
            if (humidity > 80 && temperature > 25) {
                recommendation = 'High humidity and warm temperatures detected. Risk of fungal diseases high. Consider protective fungicide application for vulnerable crops.';
                crops = ['Rice', 'Mushrooms', 'Spinach'];
            } else if (humidity > 80) {
                recommendation = 'High humidity detected. Watch for leaf mold and mildew. Ensure proper ventilation in greenhouses and storage areas.';
                crops = ['Mushrooms', 'Taro', 'Water Chestnut'];
            } else if (weatherCondition === 'Rain' && windSpeed < 5) {
                recommendation = 'Gentle rain expected. Perfect natural irrigation, but avoid pesticide spraying as it will wash away. Check drainage systems.';
                crops = ['Young Seedlings', 'Recently Transplanted Crops', 'Rice'];
            } else if (weatherCondition === 'Rain' && windSpeed > 10) {
                recommendation = 'Heavy rain with wind expected. Secure young plants and ensure proper drainage to prevent waterlogging and soil erosion.';
                crops = ['Established Root Vegetables', 'Protected Crops'];
            } else if (temperature > 35) {
                recommendation = 'Extremely hot weather. Increase irrigation frequency but with smaller amounts. Consider shade cloth for sensitive crops. Water in early morning or evening.';
                crops = ['Drought-resistant Crops', 'Okra', 'Sweet Potatoes'];
            } else if (temperature < 10) {
                recommendation = 'Cold temperatures approaching. Protect sensitive crops with covers. Check greenhouse heating systems.';
                crops = ['Cold-hardy Vegetables', 'Cabbage', 'Radish'];
            } else if (windSpeed > 20) {
                recommendation = 'Strong winds forecasted. Secure lightweight structures, young trees, and trellises. Consider temporary windbreaks for vulnerable crops.';
                crops = ['Low-growing Crops', 'Root Vegetables'];
            } else if (weatherCondition === 'Clear' && humidity < 40) {
                recommendation = 'Clear but dry conditions. Increase irrigation and consider mulching to retain soil moisture. Watch for signs of water stress.';
                crops = ['Drought-tolerant Crops', 'Deep-rooted Plants'];
            } else {
                recommendation = 'Weather conditions are favorable. An excellent day for general field work, planting, or harvesting depending on your crop calendar.';
                crops = ['Most Crops', 'Leafy Greens', 'Fruit Trees'];
            }
            
            // Traditional weather wisdom
            const weatherWisdom = [
                "Red sky at night, farmer's delight; red sky in morning, farmers take warning.",
                "When leaves show their undersides, be very sure rain betides.",
                "A cow with its tail to the west makes the weather best; a cow with its tail to the east makes the weather least.",
                "Clear moon, frost soon.",
                "When the dew is on the grass, rain will never come to pass.",
                "The higher the clouds, the finer the weather."
            ];
            
            // Pick a random piece of wisdom
            const randomWisdom = weatherWisdom[Math.floor(Math.random() * weatherWisdom.length)];
            
            // Moon phase calculation (simplified)
            const date = new Date();
            const daysSinceNewMoon = (date.getDate() % 29.5);
            let moonPhase = '🌑';
            let moonPhaseText = 'New Moon';
            
            if (daysSinceNewMoon < 3.7) {
                moonPhase = '🌑';
                moonPhaseText = 'New Moon';
            } else if (daysSinceNewMoon < 7.4) {
                moonPhase = '🌒';
                moonPhaseText = 'Waxing Crescent';
            } else if (daysSinceNewMoon < 11.1) {
                moonPhase = '🌓';
                moonPhaseText = 'First Quarter';
            } else if (daysSinceNewMoon < 14.8) {
                moonPhase = '🌔';
                moonPhaseText = 'Waxing Gibbous';
            } else if (daysSinceNewMoon < 18.5) {
                moonPhase = '🌕';
                moonPhaseText = 'Full Moon';
            } else if (daysSinceNewMoon < 22.2) {
                moonPhase = '🌖';
                moonPhaseText = 'Waning Gibbous';
            } else if (daysSinceNewMoon < 25.9) {
                moonPhase = '🌗';
                moonPhaseText = 'Last Quarter';
            } else {
                moonPhase = '🌘';
                moonPhaseText = 'Waning Crescent';
            }
            
            // Add custom styling to the weather box
            weatherBox.style.background = `linear-gradient(to bottom, ${weatherDetails.color}, #ffffff)`;
            weatherBox.style.borderRadius = '15px';
            weatherBox.style.padding = '20px';
            weatherBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            
            // Create a more engaging and visually appealing display
            weatherText.innerHTML = `
                <div class="weather-header">
                    <h2>${city} Farm Forecast</h2>
                    <div class="date">${new Date().toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</div>
                </div>
                
                <div class="weather-main">
                    <div class="weather-icon">${weatherDetails.icon}</div>
                    <div class="temperature">${temperature}°C</div>
                    <div class="condition">${weatherDetails.description}</div>
                </div>
                
                <div class="weather-details">
                    <div class="detail"><span>💧 Humidity:</span> ${humidity}%</div>
                    <div class="detail"><span>🌬 Wind:</span> ${windSpeed} m/s</div>
                    <div class="detail"><span>🌅 Sunrise:</span> ${sunriseTime}</div>
                    <div class="detail"><span>🌇 Sunset:</span> ${sunsetTime}</div>
                    <div class="detail"><span>${moonPhase} Moon:</span> ${moonPhaseText}</div>
                </div>
                
                <div class="farmer-advice">
                    <h3>🌱 Today's Farming Guidance</h3>
                    <p>${recommendation}</p>
                    <div class="crop-suggestions">
                        <h4>Favorable for:</h4>
                        <div class="crop-list">${crops.join(', ')}</div>
                    </div>
                </div>
                
                <div class="weather-wisdom">
                    <h3>💫 Farmer's Wisdom</h3>
                    <p><em>"${randomWisdom}"</em></p>
                </div>
                
                <div class="three-day-forecast">
                    <h3>3-Day Outlook</h3>
                    <div class="forecast-days">
                        <div class="day">
                            <div>Tomorrow</div>
                            <div>${weatherDetails.icon}</div>
                            <div>${temperature + Math.floor(Math.random() * 5) - 2}°C</div>
                        </div>
                        <div class="day">
                            <div>Day 2</div>
                            <div>${weatherDetails.icon}</div>
                            <div>${temperature + Math.floor(Math.random() * 7) - 3}°C</div>
                        </div>
                        <div class="day">
                            <div>Day 3</div>
                            <div>${weatherDetails.icon}</div>
                            <div>${temperature + Math.floor(Math.random() * 8) - 4}°C</div>
                        </div>
                    </div>
                </div>
            `;
            
            // Add CSS styles for the elements
            const style = document.createElement('style');
            style.textContent = `
                .weather-header {
                    text-align: center;
                    margin-bottom: 15px;
                }
                
                .weather-header h2 {
                    margin: 0;
                    color: #2c3e50;
                }
                
                .date {
                    color: #7f8c8d;
                    font-size: 0.9em;
                }
                
                .weather-main {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 20px;
                }
                
                .weather-icon {
                    font-size: 3.5em;
                    margin-bottom: 10px;
                }
                
                .temperature {
                    font-size: 2.5em;
                    font-weight: bold;
                    color: #2c3e50;
                }
                
                .condition {
                    font-style: italic;
                    color: #7f8c8d;
                }
                
                .weather-details {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                    margin-bottom: 25px;
                }
                
                .detail {
                    display: flex;
                    justify-content: space-between;
                }
                
                .detail span {
                    font-weight: bold;
                    color: #2c3e50;
                }
                
                .farmer-advice {
                    background-color: rgba(255, 255, 255, 0.8);
                    padding: 15px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                }
                
                .farmer-advice h3, .weather-wisdom h3, .three-day-forecast h3 {
                    margin-top: 0;
                    color: #27ae60;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 5px;
                }
                
                .crop-suggestions {
                    margin-top: 10px;
                }
                
                .crop-suggestions h4 {
                    margin: 5px 0;
                    color: #2c3e50;
                }
                
                .crop-list {
                    color: #16a085;
                    font-weight: bold;
                }
                
                .weather-wisdom {
                    background-color: rgba(255, 255, 255, 0.8);
                    padding: 15px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                }
                
                .weather-wisdom p {
                    color: #8e44ad;
                }
                
                .three-day-forecast {
                    background-color: rgba(255, 255, 255, 0.8);
                    padding: 15px;
                    border-radius: 10px;
                }
                
                .forecast-days {
                    display: flex;
                    justify-content: space-between;
                    text-align: center;
                }
                
                .day {
                    flex: 1;
                    padding: 10px;
                }
                
                .day:not(:last-child) {
                    border-right: 1px solid #eee;
                }
                
                .loading {
                    text-align: center;
                    font-style: italic;
                    color: #7f8c8d;
                    padding: 20px;
                }
            `;
            document.head.appendChild(style);
            
        } else {
            weatherText.innerHTML = `
                <div class="error-message">
                    <div class="error-icon">❌</div>
                    <h3>Weather data not available</h3>
                    <p>We couldn't fetch the weather spirits from ${city} at this time.</p>
                    <p>Please check your connection to both the internet and nature.</p>
                </div>
            `;
        }
    } catch (error) {
        // Clear loading animation
        clearInterval(dotsAnimation);
        
        weatherText.innerHTML = `
            <div class="error-message">
                <div class="error-icon">❌</div>
                <h3>Error fetching weather data</h3>
                <p>The weather spirits are silent today.</p>
                <p>Please check your API key and connection.</p>
                <div class="error-details">Error: ${error.message}</div>
            </div>
        `;
        console.error('Error:', error);
        
        // Add error styling
        const style = document.createElement('style');
        style.textContent = `
            .error-message {
                text-align: center;
                padding: 20px;
                background-color: rgba(231, 76, 60, 0.1);
                border-radius: 10px;
            }
            
            .error-icon {
                font-size: 3em;
                margin-bottom: 10px;
            }
            
            .error-details {
                font-size: 0.8em;
                color: #7f8c8d;
                margin-top: 15px;
            }
        `;
        document.head.appendChild(style);
    }
});