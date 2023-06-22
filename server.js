const fetch = require('node-fetch');
const express = require('express');
const request = require('request');
const cors = require('cors');
const path = require('path');

const port = process.env.PORT || 3000;
const hostName = process.env.SERVER_HOSTNAME || `localhost`;
const serverUrl = process.env.SERVER_URL || `http://localhost:${port}`;

let openWeatherAPIKey = `ce5300e7acaa327ad655b8a21d5130d8`;
let openWeatherCurrentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=Sydney&appid=${openWeatherAPIKey}`;

const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, `public/pages/home`)));

const data = {
  config: {
    port, 
    server: {
      hostName,
      url: serverUrl,
    }
  }
};

// Routes
app.get(`/`, (req, res) => {
  const url = req.query.url;
  if (url) {
    request(url).pipe(res);
  } else {
    res.sendFile(path.join(__dirname, `public/pages/home`, `index.html`));
  }
});

app.get(`/weather`, async (req, res) => {
  try {
    const response = await fetch(openWeatherCurrentWeatherURL);
    const data = await response.json();
    let lat = data.coord.lat;
    let lon = data.coord.lon;
    let openWeatherOneCallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${openWeatherAPIKey}`;
    const oneCallResponse = await fetch(openWeatherOneCallURL);
    const oneCallData = await oneCallResponse.json();
    res.json({
      CurrentWeatherAPI: data,
      OneCallAPI: oneCallData
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(`An error occurred while fetching weather data.`);
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});