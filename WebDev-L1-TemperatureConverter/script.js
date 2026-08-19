const temperatureInput = document.getElementById("temperature");
const unitSelect = document.getElementById("unit");
const convertButton = document.getElementById("convert-btn");

const celsiusResult = document.getElementById("celsius-result");
const fahrenheitResult = document.getElementById("fahrenheit-result");
const kelvinResult = document.getElementById("kelvin-result");

const errorMessage = document.getElementById("error-message");


convertButton.addEventListener("click", function () {

    const value = parseFloat(temperatureInput.value);
    const unit = unitSelect.value;

    errorMessage.textContent = "";

    if (temperatureInput.value.trim() === "") {
        errorMessage.textContent = "Please enter a temperature.";
        clearResults();
        return;
    }

    if (isNaN(value)) {
        errorMessage.textContent = "Please enter a valid numeric value.";
        clearResults();
        return;
    }


    let celsius;
    let fahrenheit;
    let kelvin;


    if (unit === "celsius") {

        celsius = value;
        fahrenheit = (value * 9 / 5) + 32;
        kelvin = value + 273.15;

    } else if (unit === "fahrenheit") {

        fahrenheit = value;
        celsius = (value - 32) * 5 / 9;
        kelvin = celsius + 273.15;

    } else if (unit === "kelvin") {

        kelvin = value;
        celsius = value - 273.15;
        fahrenheit = (celsius * 9 / 5) + 32;

    }


    if (celsius < -273.15) {
        errorMessage.textContent =
            "Temperature cannot be below absolute zero (-273.15°C).";

        clearResults();
        return;
    }


    celsiusResult.textContent =
        `${celsius.toFixed(2)} °C`;

    fahrenheitResult.textContent =
        `${fahrenheit.toFixed(2)} °F`;

    kelvinResult.textContent =
        `${kelvin.toFixed(2)} K`;
});

function clearResults() {

    celsiusResult.textContent = "-- °C";
    fahrenheitResult.textContent = "-- °F";
    kelvinResult.textContent = "-- K";
}