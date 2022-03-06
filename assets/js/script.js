var api_key="b6c9caa257a28a219fbe8ce4353a3c83";
var lon='';
var lat='';
var city='Manilla';
var inputEl = $(".search");

var getCityDetails = function(city)
{
    //This api will take the city string and return the latitude/longitude. This will allow the user to input a city name instead of location details
    //Geo details are required for the api with forecast data. Limiting data returned to 1 record.
    //
    var geoCodeUrl= "http://api.openweathermap.org/geo/1.0/direct?q="+city+"&limit=1&appid="+api_key;

    fetch(geoCodeUrl)
    .then ( function(response){
        return response.json();
    })
    .then (function(data){  
        //console.log(data);             
        lat = data[0].lat;
        lon = data[0].lon;
        //console.log(lat);
        //console.log(lon);
    })
    .then (function(){
        getWeatherData();
    });
}

var getWeatherData = function(){
    //This api call will use the latitude and longitude to return current and forecast data
    var url = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&appid="+api_key+"&units=imperial";

    fetch(url)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        //Call the following function to display the current weather. Only the current weather details are passed to the function.
        printCurrentWeather(data.current);

        //Call the following function to display the 5 day forecast. Only the forecast weather details are passed to the function.
        printForecastWeather(data.daily);       
    });
 }

 var printCurrentWeather = function(data){
    var getWeatherTodayEl = $(".weather-today");
    var getDate = new Date(data.dt * 1000); 
    var cityDate = city+' ('+getDate.toLocaleDateString()+')';
    var temp = data.temp+"F";
    var wind = data.wind_speed+" mph";
    var humidity = data.humidity+"%";
    var uvi = data.uvi;   

    var listCityEl = $("<li>").addClass("day card-item").text(cityDate);
    var tempEl = $("<li>").addClass("card-item").text(temp);
    var windEl = $("<li>").addClass("card-item").text(wind);
    var humidityEl = $("<li>").addClass("card-item").text(humidity);
    var uvEl = $("<li>").addClass("card-item").text(uvi);
    
    getWeatherTodayEl.append(listCityEl,tempEl,windEl, humidityEl, uvEl);
 }

 var printForecastWeather = function(data){
    console.log(data);
 }

getCityDetails(city);