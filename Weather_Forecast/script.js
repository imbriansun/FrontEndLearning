function handleResponse(response){
    // Handling backgroundImg
    switch (response.result.weather){
        case "晴":
            document.body.style.backgroundImage = 'url("https://s1.ax1x.com/2020/08/06/agwbgH.png")';
            break;
        case "多云":
        case "阴":
        case "雾":
            document.body.style.backgroundImage = 'url("https://s1.ax1x.com/2020/08/06/agwMnI.png")';
            break;
        case "雷阵雨":
        case "小雨":
        case "中雨":
        case "大雨":
            document.body.style.backgroundImage = 'url("https://s1.ax1x.com/2020/08/06/ag0ivj.png")';
            break;
        default:
            document.body.style.backgroundImage = 'url("https://s1.ax1x.com/2020/08/06/ag0ILn.png")';
            break;
    }
    // Handling intradayWeatherInfo
    var cityHeader = document.getElementById("cityHeader");
    var temperatureElement = document.getElementById("temperature");
    var weatherDescriptionHeader = document.getElementById("weatherDescriptionHeader");
    var windSpeedHeader = document.getElementById("windSpeed");
    var humidityElement = document.getElementById("humidity");
    var weatherIcon = document.getElementById("documentIconImg");

    weatherIcon.src = "https://www.jisuapi.com/weather/static/images/weathercn/"+response.result.img+".png";

    cityHeader.innerHTML = response.result.city;
    weatherDescriptionHeader.innerText = response.result.weather;
    temperatureElement.innerHTML = Math.floor(response.result.temp) + "&#176";
    windSpeedHeader.innerHTML = response.result.winddirect + " " + response.result.windpower;
    humidityElement.innerHTML = "湿度：" + response.result.humidity + "%";


    // Handling hourlyWeatherForecast


    // setPositionForWeatherInfo -- intraday
    setPositionForWeatherInfo();
}

function setPositionForWeatherInfo(){
    var weatherContainer = document.getElementById("weatherContainer");

    weatherContainer.style.visibility = "visible";
}


function searchWeather(searchTerm){
    var script = document.createElement("script");
    script.src = "https://api.jisuapi.com/weather/query?appkey=bd87493350ec7055&city="+searchTerm+"&callback=handleResponse";
    document.body.insertBefore(script, document.body.firstChild);
}


document.getElementById("searchBtn").addEventListener("click", function(){
    var searchTerm = document.getElementById("searchInput").value;
    if(searchTerm){
        searchWeather(searchTerm);
    }
})

