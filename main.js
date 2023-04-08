const apiKey = "0e51794dc88e10c3eab5c83c4569fb4b";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=`;
let cityName = document.querySelector("#cityName");
let degrees = document.querySelector("#degrees");
let dayTodey = document.querySelector("#dayTodey");
let iconWeather = document.querySelector("#iconWeather");
let weatherCloud = document.querySelector("#weatherCloud");
let templateSearch = document.querySelector("#templateSearch");

let geoPromise = new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(updateLocation, handleError);

    function updateLocation(position) {
        resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
        })
    }

    function handleError(error) {
        switch (error.code) {
            case 0:
                console.log(error.message);
                break;
            case 1:
                console.log(error.message);
                givSearchWeather();
                break;
            case 2:
                console.log(error.message);
                break;
            case 3:
                console.log("Истекло доступное время ожидания.");
                break;
        }
    }
});

geoPromise
    .then(coor => {
        let link = "https://api.openweathermap.org/data/2.5/weather?lat=" + coor.lat + "&lon=" + coor.lon + "&limit=5&appid=" + apiKey + "";
        return fetch(link);
    })
    .then(response => response.json())
    .then(data => {
        cityName.innerHTML = data.name;
        degrees.innerHTML = Math.round(data.main.temp - 273) + '&#176';
        dayTodey.innerHTML = givDay();
        iconWeather.innerHTML = '<img src="http://openweathermap.org/img/wn/' + data.weather[0]['icon'] + '@2x.png">';
        weatherCloud.innerHTML = data.weather[0]['description'];
    })
    .catch(error => console.log(error.message));

function givDay() {
    let week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let date = new Date().getDay();
    return week[date];
}

function givSearchWeather() {
    let templateSearchClone = templateSearch.content.cloneNode(true);
    document.querySelector("body").appendChild(templateSearchClone);

    document.querySelector("#search").addEventListener("keydown", function (e) {
        if (e.code == "Enter") {
            let citySearch = document.querySelector("#search").value;
            document.querySelector(".askCity").style.display = "none";
            document.querySelector(".searchCity").style.display = "none";
            showSearchWeather(citySearch);
        };
    });
}

function showSearchWeather(city) {
    let link = apiUrl + city + `&appid=${apiKey}`;
    fetch(link)
    .then(response => response.json())
    .then(data => {
        cityName.innerHTML = data.name;
        degrees.innerHTML = Math.round(data.main.temp) + '&#176';
        dayTodey.innerHTML = givDay();
        iconWeather.innerHTML = '<img src="http://openweathermap.org/img/wn/' + data.weather[0]['icon'] + '@2x.png">';
        weatherCloud.innerHTML = data.weather[0]['description'];
    })
    .catch(error => console.log(error.message));
}