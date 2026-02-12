const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const m = require('morgan')

const app = express();
const PORT = 8001;

app.use(cors());
app.use(express.static('public'));
app.use(m('dev'))

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    const apiKey = process.env.WEATHER_API_KEY;

    console.log(`--- Request Received for: ${city} ---`);

    if (!apiKey) {
        console.error("ERROR: API Key is missing from .env file!");
        return res.status(500).json({ error: "Server API key configuration error" });
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        const response = await axios.get(url);
        console.log("search",response);
        res.json(response.data);
    } catch (error) {
        if (error.response) {
            console.log("OpenWeather Error:", error.response.data.message);
            res.status(error.response.status).json({ error: error.response.data.message });
        } else {
            console.log("Connection Error:", error.message);
            res.status(500).json({ error: "Failed to connect to Weather API" });
        }
    }
});

// IMPORTANT: Make sure this part is at the very bottom
app.listen(PORT, () => {
    console.log(`====================================`);
    console.log(`✅ Server is ACTIVE on port ${PORT}`);
    console.log(`====================================`);
});












































// const express = require('express');

// const axios = require('axios');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.static('public'));

// app.get('/weather', async (req, res) => {
   
//     const city = req.query.city;
//      console.log("searching city",city)
//     const apiKey = process.env.WEATHER_API_KEY;
//     const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

//     try {
//         const response = await axios.get(url);
//         console.log("data", response)
//         res.json(response.data);
//     } catch (error) {
//         res.status(404).json({ error: "City not found" });
//     }
// });

// app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));