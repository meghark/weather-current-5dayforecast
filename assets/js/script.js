var api_key="b6c9caa257a28a219fbe8ce4353a3c83";
var lon='';
var lat='';
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
    var url = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&appid="+api_key+"&units=imperial";

    fetch(url)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        printCurrentWeather(data.current);
        printForecastWeather(data.daily);       
    });
 }

 var printCurrentWeather = function(data){
    console.log(data);
 }

 var printForecastWeather = function(data){
    console.log(data);
 }

getCityDetails('San Diego');