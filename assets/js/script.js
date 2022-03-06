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
    var geoCodeUrl= "https://api.openweathermap.org/geo/1.0/direct?q="+city+"&limit=1&appid="+api_key;

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
    //This api call will use the latitude and longitude to return current and forecast data.
    //The web page displays only the current and  daily data. So the api call includes the parameter to exclude minutely, hourly , alerts etc.
    //Fetch only the rquired information.
    var url = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&appid="+api_key+"&units=imperial&exclude=minutely,hourly,alerts";

    fetch(url)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
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
        var forecastHeaderEl= $(".header-forecast");
        var headerEl = $("<h2>").text("5-Day Forecast:");
        forecastHeaderEl.append(headerEl);

        var forecastEl = $(".forecast") ;
        for (var i =0 ; i<5; i++)
        {
            var current = data[i];
            var getDate = new Date(current.dt * 1000);  
            
            var divCardEl = $("<div>")
                            .addClass("pure-u-1 pure-u-md-1-5");
            
            var ulEl = $("<ul>")
                        .addClass("weatherCard");
              
            var dateEl = $("<li>")
                        .addClass("day")
                        .text(getDate.toLocaleDateString());
            var tempEl = $("<li>")
                        .text(current.temp.max);
            var windEl = $("<li>")
                        .text(current.wind_speed+" Mph");
            var humidityEl = $("<li>")
                        .text(current.humidity+" %");

            ulEl.append(dateEl, tempEl, windEl, humidityEl);
            divCardEl.append(ulEl);
            forecastEl.append(divCardEl);
        }
 }

//getCityDetails(city);

var showData = function(event){
    event.preventDefault();
    $(".weather-today").empty();
    $(".header-forecast").empty();
    $(".forecast").empty();

    var inputCityEl = $("#search").val();
    console.log(inputCityEl);
    if(inputCityEl)
    {
        var cities = JSON.parse(localStorage.getItem("cities"));
        if(!cities){
            cities =[];
        }
        cities.push(inputCityEl);
        //showSearchHistory();

        localStorage.setItem("cities", JSON.stringify(cities));
        getCityDetails(inputCityEl);        
    }
    $(inputCityEl).val('');
 }

$(".search-form").submit(showData);