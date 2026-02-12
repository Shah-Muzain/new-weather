async function getWeather() {
    console.log("button was clicked")
    const city = document.getElementById('cityInput').value;
    console.log("hello",city)
    try {
        // Updated to Port 5000
        const response = await fetch(`/weather?city=${city}`);

        const data = await response.json();

        if(data.error) {
            alert(data.error);
        } else {
            document.getElementById('cityName').innerText = data.name;
            document.getElementById('temp').innerText = Math.round(data.main.temp) + "°C";

const iconCode = data.weather[0].icon;
document.getElementById("icon").src =
  `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        }
    } catch (err) {
        console.error("Server connection failed");
    }
}