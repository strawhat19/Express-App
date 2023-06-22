// let server = `http://localhost:3000`;
// let dataFromServer = `${server}/data`;
// let weatherFromServerURL = `${server}/weather`;
 
// fetch(weatherFromServerURL).then(resp => resp.json()).then(data => {
//     console.log(`OpenWeather Data from Server`, data);
// });

let apiUrl = `https://randomuser.me/api/`;

let elementsWhereWeDisplayData = document.querySelector(`.frontendApiDataToDisplay`);
let imageToDisplay = document.querySelector(`.imageToDisplay`);

fetch(apiUrl).then(resp => resp.json()).then(data => {
    let randomuser = data.results[0];
    imageToDisplay.src = randomuser.picture.large;
    elementsWhereWeDisplayData.innerHTML = randomuser.name.first + ` ` + randomuser.name.last;
});

let nasaAPIkey = `CwT97V0rv5h71P9USOIkWpS2qu3toeGlkYX4vrSx`;
let nasaUrl = `https://api.nasa.gov/planetary/apod?api_key=${nasaAPIkey}`;

let nasadiv = document.querySelector(`.nasaImageToDisplay`);
let nasaImage = document.querySelector(`img.nasa`);

fetch(nasaUrl).then(resp => resp.json()).then(data => {
    let imageUrl = data.hdurl;
    let imageTitle = data.title;
    nasadiv.innerHTML = imageTitle;
    nasaImage.src = imageUrl;
});

let openWeatherAPIKey = `ce5300e7acaa327ad655b8a21d5130d8`;
let openWeatherCurrentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=Sydney&appid=${openWeatherAPIKey}`;

fetch(openWeatherCurrentWeatherURL).then(resp => resp.json()).then(data => {
    let lat = data.coord.lat;
    let lon = data.coord.lon;
    let openWeatherOneCallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${openWeatherAPIKey}`;
    fetch(openWeatherOneCallURL).then(resp => resp.json()).then(dataFromOneCall => {
        console.log(`OpenWeather Data from Client`, dataFromOneCall);
    });
});