// Import libraries we need from Node
const fetch = require('node-fetch');
const express = require('express');
const request = require('request');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

// Define what we need to start the Express Server
const port = process.env.PORT || 3000;

const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, `public/pages/home`)));

app.get(`/`, (req, res) => {
  const url = req.query.url;
  if (url) {
    request(url).pipe(res);
  } else {
    res.sendFile(path.join(__dirname, `public/pages/home`, `index.html`));
  }
});

app.get(`/nasa`, async (req, res) => {
  try {
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASAAPIKEY}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send(`An error occurred while fetching weather data.`);
  }
});

app.get(`/weather`, async (req, res) => {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Sydney&appid=${process.env.OPENWEATHERAPIKEY}`);
    const data = await response.json();
    let lat = data.coord.lat;
    let lon = data.coord.lon;
    let openWeatherOneCallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHERAPIKEY}`;
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