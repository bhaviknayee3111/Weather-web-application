const searchInput = document.querySelector(".search-box input");
const searchButton = document.querySelector(".search-box button");

searchButton.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city) {
    getWeather(city);
    getForecast(city);
  }
});

// Optional: Enter key triggers search
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchButton.click();
});

async function getWeather(city) {
  try {
    const response = await fetch(`./weather.php?city=${encodeURIComponent(city)}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    if (data.cod !== 200) {
      alert("❌ Invalid City! Please enter a valid city name.");
      return;
    }

    // Update basic weather UI
    document.querySelector(".city").textContent = data.name;
    document.querySelector(".temp").textContent = `${Math.round(data.main.temp)}°C`;
    document.querySelector(".condition").textContent = data.weather[0].description;
    document.querySelector(".icon").textContent = getWeatherIcon(data.weather[0].main);

    // Update weather details
    document.querySelector(".left p:nth-of-type(1)").textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;
    document.querySelector(".left p:nth-of-type(2)").textContent = `Humidity ${data.main.humidity}%`;
    document.querySelector(".left p:nth-of-type(3)").textContent = `Wind ${data.wind.speed} km/h`;
    document.querySelector(".left p:nth-of-type(4)").textContent = `Pressure ${data.main.pressure} hPa`;

    // Update sunrise/sunset
    const sunrise = new Date(data.sys.sunrise * 1000);
    const sunset = new Date(data.sys.sunset * 1000);
    
    const formatTime = (date) => {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const sunTimes = document.querySelectorAll(".sun-times span");
    sunTimes[0].innerHTML = `Sunrise<br />${formatTime(sunrise)}`;
    sunTimes[1].innerHTML = `Sunset<br />${formatTime(sunset)}`;

  } catch (error) {
    console.error("Error fetching weather:", error);
    alert("Failed to fetch weather data!");
  }
}

async function getForecast(city) {
  try {
    const response = await fetch(`./forecast.php?city=${encodeURIComponent(city)}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    if (data.cod !== "200") {
      console.error("Forecast not available");
      return;
    }

    // Update hourly forecast (next 5 entries)
    const hourlyItems = document.querySelectorAll(".hourly-items .item");
    for (let i = 0; i < Math.min(5, data.list.length); i++) {
      const forecast = data.list[i];
      const time = new Date(forecast.dt * 1000);
      const hour = time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: false });
      
      hourlyItems[i].querySelector("p:first-child").textContent = hour + ":00";
      hourlyItems[i].querySelector("span").textContent = getWeatherIcon(forecast.weather[0].main);
      hourlyItems[i].querySelector("p:last-child").textContent = `${Math.round(forecast.main.temp)}°`;
    }

    // Update 7-day forecast
    const dailyItems = document.querySelectorAll(".daily-items .day");
    const dailyData = {};
    
    // Group by date
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toDateString();
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = item;
      }
    });

    const dates = Object.keys(dailyData).slice(0, 7);
    dates.forEach((dateKey, i) => {
      if (i < dailyItems.length) {
        const forecast = dailyData[dateKey];
        const date = new Date(forecast.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        dailyItems[i].querySelector("p:first-child").textContent = dayName;
        dailyItems[i].querySelector("span").textContent = getWeatherIcon(forecast.weather[0].main);
        dailyItems[i].querySelector("p:last-child").textContent = `${Math.round(forecast.main.temp)}°`;
      }
    });

  } catch (error) {
    console.error("Error fetching forecast:", error);
  }
}

// Simple weather icons
function getWeatherIcon(condition) {
  condition = condition.toLowerCase();
  switch (condition) {
    case "clear": return "☀️";
    case "clouds": return "⛅";
    case "rain": return "🌧️";
    case "snow": return "❄️";
    case "thunderstorm": return "⛈️";
    default: return "🌍";
  }
}