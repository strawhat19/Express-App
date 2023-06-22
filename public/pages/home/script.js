let api = ``;
let elementsWhereWeDisplayData = document.querySelector(`.frontendApiDataToDisplay`);
let imageToDisplay = document.querySelector(`.imageToDisplay`);
let nasadiv = document.querySelector(`.nasaImageToDisplay`);
let userSpinner = document.querySelector(`#userSpinner`);
let nasaSpinner = document.querySelector(`#nasaSpinner`);
let nasaImage = document.querySelector(`img.nasa`);

let randomUserDataLoaded = false;
let nasaDataLoaded = false;
let weatherDataLoaded = false;

if (window.location.host.includes(`localhost`) || window.location.host.includes(`8080`)) {
    api = `http://localhost:3000`;
} else {
    api = window.location.origin;
}

const fetchRandomUser = async () => {
    try {
        let response = await fetch(`https://randomuser.me/api/`);
        let data = await response.json();
        
        if (data) {
            console.log(`Random User Data from Server`, data);
            let randomuser = data.results[0];
            imageToDisplay.src = randomuser.picture.large;
            elementsWhereWeDisplayData.innerHTML = randomuser.name.first + ` ` + randomuser.name.last;
            randomUserDataLoaded = true;
            userSpinner.style.opacity = 0;
        }
    } catch (error) {
        console.log(error);
    }
}

const fetchNasaData = async () => {
    try {
        let response = await fetch(`${api}/nasa`);
        let data = await response.json();
        
        if (data) {
            console.log(`Nasa Data from Server`, data);
            let imageUrl = data.hdurl;
            let imageTitle = data.title;
            nasadiv.innerHTML = imageTitle;
            nasaImage.src = imageUrl;
            nasaDataLoaded = true;
            nasaSpinner.style.opacity = 0;
        }
    } catch (error) {
        console.log(error);
    }
}

const fetchWeatherData = async () => {
    try {
        let response = await fetch(`${api}/weather`);
        let data = await response.json();
        
        if (data) {
            console.log(`OpenWeather Data from Server`, data);
            weatherDataLoaded = true;
        }
    } catch (error) {
        console.log(error);
    }
}

if (api != ``) {
    fetchRandomUser();
    fetchNasaData();
    fetchWeatherData();
}