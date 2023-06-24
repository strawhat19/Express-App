let elementsWhereWeDisplayData = document.querySelector(`.frontendApiDataToDisplay`);
let weatherIconToDisplay = document.querySelector(`img.weatherIconToDisplay`);
let storedNasaData = JSON.parse(localStorage.getItem(`NasaData`));
let weatherdiv = document.querySelector(`.weatherDataToDisplay`);
let weatherSpinner = document.querySelector(`#weatherSpinner`);
let askUserButton = document.querySelector(`.askUserLocation`);
let imageToDisplay = document.querySelector(`.imageToDisplay`);
let userSpinner = document.querySelector(`#userSpinner`);
let nasaSpinner = document.querySelector(`#nasaSpinner`);
let nasadiv = document.querySelector(`.nasaEndData`);
let nasaImage = document.querySelector(`img.nasa`);
let api = ``;

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
            document.querySelector(`.randomUser.apiData`).classList.remove(`dataLoading`);
            let randomuser = data.results[0];
            imageToDisplay.src = randomuser.picture.large;
            elementsWhereWeDisplayData.innerHTML = randomuser.name.first + ` ` + randomuser.name.last;
            document.querySelector(`.ageElem`).innerHTML = randomuser.dob.age;
            document.querySelector(`.streetAddress`).innerHTML = `${randomuser.location.street.number} ${randomuser.location.street.name}`;
            document.querySelector(`.cityStateZip`).innerHTML = `${randomuser.location.city}, ${randomuser.location.state} ${randomuser.location.postcode}`;
            document.querySelector(`.country`).innerHTML = `${randomuser.location.country}`;
            userSpinner.style.opacity = 0;
            userSpinner.style.height = `0px`;
            userSpinner.style.pointerEvents = `none`;
        }
    } catch (error) {
        console.log(error);
        document.querySelector(`.randomUser.apiData`).remove();
        return;
    }
}

const fetchNasaData = async (storedData) => {
    const setUIData = (data, storedData) => {
        console.log(!storedData ? `Nasa Data from Server` : `Cached Nasa Data from Server`, data);
        document.querySelector(`.nasa.apiData`).classList.remove(`dataLoading`);
        localStorage.setItem(`NasaData`, JSON.stringify(data));
        let imageUrl = data.hdurl;
        let imageTitle = data.title;
        nasadiv.innerHTML = imageTitle;
        nasaImage.src = imageUrl;
        document.querySelector(`.nasaPicDay`).innerHTML = `${data.explanation}`;
        nasaSpinner.style.opacity = 0;
        nasaSpinner.style.height = `0px`;
        nasaSpinner.style.pointerEvents = `none`;
    }
   if (storedData) {
    setUIData(storedData,storedData);
   } else {
    try {
        let response = await fetch(`${api}/nasa`);
        let data = await response.json();
        
        if (data) {
            setUIData(data, storedData);
        }
    } catch (error) {
        console.log(error);
        document.querySelector(`.nasa.apiData`).remove();
        return;
    }
   }
}

const removeTrailingZeroDecimal = (number) => {
    let num = typeof number == `string` ? parseFloat(number) : number;
    const wholeNumber = Math.trunc(num);
    const decimalPart = num - wholeNumber;
    if (decimalPart === 0) {
        return wholeNumber;
    } else {
        return num.toFixed(1);
    }
}

const convertFromKelvinToFahrenheit = (temp) => removeTrailingZeroDecimal(((temp - 273.15) * 1.8 + 32.00).toFixed(0));

const formatCoord = (coord, isLongitude) => {
    const direction = isLongitude ? (coord > 0 ? `E` : `W`) : (coord > 0 ? `N` : `S`);
    return `${Math.abs(coord)} ${direction}`;
}

const setWeatherUI = (data) => {
    let iconLink = `https://openweathermap.org/img/wn/${data.OneCallAPI.current.weather[0].icon}@2x.png`;
    weatherIconToDisplay.src = iconLink;
    document.querySelector(`.locationWeather`).innerHTML = `${data.CurrentWeatherAPI.name}, ${data.CurrentWeatherAPI.sys.country}`;
    
    document.querySelector(`.temp`).innerHTML = `${convertFromKelvinToFahrenheit(data.OneCallAPI.current.temp)} °F, ${data.OneCallAPI.current.weather[0].main}`;
    document.querySelector(`.time`).innerHTML = `${moment.unix(data.OneCallAPI.current.dt).tz(data.OneCallAPI.timezone).format(`dddd, MMMM Do, h:mm A`)} <br> In ${data.CurrentWeatherAPI.name}, ${data.CurrentWeatherAPI.sys.country} Time`;

    document.querySelector(`.coords`).innerHTML = `${formatCoord(data.OneCallAPI.lat, false)}, ${formatCoord(data.OneCallAPI.lon, true)}`;
}

const fetchWeatherData = async (coordinates) => {
    if (coordinates) {
        try {
            let response = await fetch(`${api}/weather?lat=${coordinates.lat}&lon=${coordinates.lon}`);
            let data = await response.json();
            
            if (data) {
                console.log(`OpenWeather Coordinate Data from Server`, data);
                setWeatherUI(data);
            }
        } catch (error) {
            document.querySelector(`.weather.apiData`).remove();
            console.log(error);
        }
    } else {
        try {
            let response = await fetch(`${api}/weather`);
            let data = await response.json();
            
            if (data) {
                console.log(`OpenWeather Data from Server`, data);
                document.querySelector(`.weather.apiData`).classList.remove(`dataLoading`);
                
                setWeatherUI(data);

                weatherSpinner.style.opacity = 0;
                weatherSpinner.style.height = `0px`;
                weatherSpinner.style.pointerEvents = `none`;
            }
        } catch (error) {
            document.querySelector(`.weather.apiData`).remove();
            console.log(error);
        }
    }
}

if (api != ``) {
    fetchRandomUser();
    if (!storedNasaData || moment(storedNasaData.date).isBefore(moment(), `day`)) {
        fetchNasaData();
    } else {
        fetchNasaData(storedNasaData);
    }
    fetchWeatherData();
}

const askUserForLocation = (e) => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let coordinates = {lat: position.coords.latitude, lon: position.coords.longitude};
            fetchWeatherData(coordinates);
        });
    } else {
        console.log(`Geolocation is not supported by this browser.`);
    }    
}

askUserButton.addEventListener(`click`, (e) => askUserForLocation(e));