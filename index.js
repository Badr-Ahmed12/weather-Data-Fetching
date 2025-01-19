    const weatherForm = document.getElementById("weatherForm");
    const cityInput = document.getElementById("cityInput");
    const weatherResult = document.getElementById("weatherResult");
    const errorMessage = document.getElementById("errorMessage");
    const locationEl = document.getElementById("location");
    const weatherCondition = document.getElementById("weatherCondition");
    const temperature = document.getElementById("temperature");
    const feelsLike = document.getElementById("feelsLike");
    const humidity = document.getElementById("humidity");
    const windSpeed = document.getElementById("windSpeed");
    const unitToggle = document.getElementById("unitToggle");
    const favoriteButton = document.getElementById("favoriteButton");
    const favoritesList = document.getElementById("favoritesList");
    const historyList = document.getElementById("historyList");

    let isCelsius = true;
    const favorites = [];
    const history = [];

    weatherForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const city = cityInput.value.trim();
      if (!city) return;

      errorMessage.classList.add("hidden");
      weatherResult.classList.add("hidden");

      try {
        // Fetch weather data
        const response = await fetch(
          `https://wttr.in/${city}?format=%C+|+%t+|+%l+|+%h+|+%w+|+%f`
        );
        const data = await response.text();
        if (data.includes("Unknown location")) throw new Error("City not found");

        // Parse response
        const [condition, temp, location, humidityVal, wind, feelsLikeTemp] = data
          .split("|")
          .map((item) => item.trim());

        // Update UI
        weatherResult.classList.remove("hidden");
        locationEl.textContent = location;
        weatherCondition.textContent = condition;
        temperature.textContent = isCelsius ? temp : convertToFahrenheit(temp);
        feelsLike.textContent = isCelsius ? feelsLikeTemp : convertToFahrenheit(feelsLikeTemp);
        humidity.textContent = humidityVal;
        windSpeed.textContent = wind;

        updateBackground(condition);

        // Add to search history
        addToHistory(city);
      } catch (error) {
        errorMessage.classList.remove("hidden");
        errorMessage.textContent = error.message;
      }
    });

    unitToggle.addEventListener("click", () => {
      isCelsius = !isCelsius;
      unitToggle.textContent = isCelsius ? "Switch to °F" : "Switch to °C";
    });

    favoriteButton.addEventListener("click", () => {
      const favoriteCity = locationEl.textContent;
      if (!favorites.includes(favoriteCity)) {
        favorites.push(favoriteCity);
        updateFavorites();
      }
    });

    function updateFavorites() {
      favoritesList.innerHTML = favorites.map((city) => `<li>${city}</li>`).join("");
    }

    function addToHistory(city) {
      if (!history.includes(city)) {
        history.unshift(city);
        if (history.length > 5) history.pop(); // Limit history to 5
        updateHistory();
      }
    }

    function updateHistory() {
      historyList.innerHTML = history.map((city) => `<li>${city}</li>`).join("");
    }

    function convertToFahrenheit(temp) {
      return `${Math.round((parseFloat(temp) * 9) / 5 + 32)}°F`;
    }

    function updateBackground(condition) {
      const body = document.body;
      body.className = "transition-colors duration-500";
      if (condition.toLowerCase().includes("sun")) body.classList.add("sunny");
      else if (condition.toLowerCase().includes("cloud")) body.classList.add("cloudy");
      else if (condition.toLowerCase().includes("rain")) body.classList.add("rainy");
      else body.classList.add("default");
    }
