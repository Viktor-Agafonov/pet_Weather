const apiKey = "0e51794dc88e10c3eab5c83c4569fb4b";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=`;
let apiUrlForFiveDays = `https://api.openweathermap.org/data/2.5/forecast?q=`;
let cityName = document.querySelector("#cityName");
let degrees = document.querySelector("#degrees");
let dayTodey = document.querySelector("#dayTodey");
let iconWeather = document.querySelector("#iconWeather");
let weatherCloud = document.querySelector("#weatherCloud");
let templateSearch = document.querySelector("#templateSearch");
let buttonChange = document.querySelector("#buttonChange");
let appSecond = document.querySelector(".appSecond");

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
        let link = "https://api.openweathermap.org/data/2.5/forecast?lat=" + coor.lat + "&lon=" + coor.lon + "&limit=5&appid=" + apiKey + "";
        return fetch(link);
    })
    .then(response => response.json())
    .then(data => fillTheWeather(data))
    .catch(error => console.log(error.message));

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
    let link = apiUrlForFiveDays + city + `&appid=${apiKey}`;
    fetch(link)
        .then(response => response.json())
        .then(data => fillTheWeather(data))
        .catch(error => {
            console.log(error.message);
            cityName.innerHTML = `City is incorrect, <br/> try again`;
            cityName.style.fontSize = "44px";
            degrees.innerHTML = "";
            dayTodey.innerHTML = "";
            iconWeather.innerHTML = '<img src="error.png">';
            weatherCloud.innerHTML = "";
        });
}

buttonChange.addEventListener("click", showChangeSearc)

function showChangeSearc() {
    let div = document.createElement("div");
    div.classList.add("changeCity");
    let input = document.createElement("input");
    input.classList.add("inputCity");
    div.append(input);
    let infoWeather = document.querySelector(".infoWeather")
    infoWeather.firstElementChild.replaceWith(div);

    document.querySelector(".inputCity").addEventListener("keydown", function (e) {
        if (e.code == "Enter") {
            let citySearch = document.querySelector(".inputCity").value;
            appSecond.innerHTML = "";
            showSearchWeather(citySearch);
            infoWeather.firstElementChild.replaceWith(cityName);
        };
    });
}

function fillTheWeather(data) {
    cityName.style.fontSize = "55px";
    cityName.innerHTML = data.city.name;
    degrees.innerHTML = Math.round(data.list[0].main.temp - 273) + '&#176';
    dayTodey.innerHTML = givDay();
    iconWeather.innerHTML = '<img src="http://openweathermap.org/img/wn/' + data.list[0].weather[0]['icon'] + '@2x.png">';
    weatherCloud.innerHTML = data.list[0].weather[0]['description'];
    let arrayDataDayForWeek = createArrayDataDayForWeek(data);
    appSecond.append(createDivforWeek(arrayDataDayForWeek, 0));
    appSecond.append(createDivforWeek(arrayDataDayForWeek, 1));
    appSecond.append(createDivforWeek(arrayDataDayForWeek, 2));
    appSecond.append(createDivforWeek(arrayDataDayForWeek, 3));
    appSecond.append(createDivforWeek(arrayDataDayForWeek, 4));
}

function givDay() {
    let week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let date = new Date().getDay();
    return week[date];
}

function givDayForWeek(day) {
    let week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let date = new Date().getDay();
    return week[date + day];
}

function createArrayDataDayForWeek(data) {
    return [createDayForWeek(8, 1, data), createDayForWeek(16, 2, data), createDayForWeek(24, 3, data), createDayForWeek(32, 4, data), createDayForWeek(39, 5, data)];
    function createDayForWeek(indexWeather, indexDay, data) {
        return {
            degrees: Math.round(data.list[indexWeather].main.temp - 273) + '&#176',
            day: givDayForWeek(indexDay),
            iconWeather: '<img src="http://openweathermap.org/img/wn/' + data.list[indexWeather].weather[0]['icon'] + '@2x.png">',
            weatherCloud: data.list[indexWeather].weather[0]['description']
        }
    }
}

function createDivforWeek(array, index) {
    let div = document.createElement("div");
    div.classList.add("forfiveDays");
    let divDay = document.createElement("div");
    divDay.classList.add("dayOfTheWeek");
    divDay.innerHTML = array[index].day;
    let divDegrees = document.createElement("div");
    divDegrees.classList.add("degreesOfTheWeek");
    divDegrees.innerHTML = array[index].degrees;
    let divIconWeather = document.createElement("div");
    divIconWeather.classList.add("iconWeatherOfTheWeek");
    divIconWeather.innerHTML = array[index].iconWeather;
    let divWeatherCloud = document.createElement("div");
    divWeatherCloud.classList.add("weatherCloudOfTheWeek");
    divWeatherCloud.innerHTML = array[index].weatherCloud;
    div.append(divDay);
    div.append(divDegrees);
    div.append(divIconWeather);
    div.append(divWeatherCloud);
    return div;
}