var api_key="b6c9caa257a28a219fbe8ce4353a3c83";
//var geoDetails ={};
var lon='';
var lat='';
var city='';

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
        console.log(data);     
        lat= data[0].lat ;
        lon= data[0].lon ;
        if(lat && lon)
        {
            //If the user provided a valid city name save the city name for later searches.
            var cities = JSON.parse(localStorage.getItem("cities"));
            if(!cities){
                cities =[];
            }
            //Push the searched city only if it doesn't exist in local storage.
            if(!cities.some(value => value.toLowerCase() == city.toLowerCase()))
            {
                cities.push(city);
            } 
            localStorage.setItem("cities", JSON.stringify(cities));
            getWeatherData();
            showSearchHistory();        
        }
    })    
    .catch(function (error)
    {console.log("Error while accessing geo api in openweathermap ,", error);
        return 0;
    });
}

var getWeatherData = function(geoLoc){
    //This api call will use the latitude and longitude to return current and forecast data.
    //The web page displays only the current and  daily data. So the api call includes the parameter to exclude minutely, hourly , alerts etc.
    //Fetch only the required information.
    //Unit is set as imperial in api call, this is to have temprature values in farenhiet, wind in mph in reponse.
    console.log(lat);
    console.log(lon);
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
    })
    .catch( function(error){
        console.log("Errow while calling openweathermap onecall api ,", error);
    });
 }

var getColorClass = function(idx){
    var returnColor ='';
    var index = parseFloat(idx);
    //debugger;
    //Function calculates the class to assign based on the UV index.
    if (index <= 2)
    {
        returnColor ="uv-color-green";
    }
    else if(index > 2 && index <= 5 )
    {
        returnColor ="uv-color-yellow";
    }
    else if(index > 5 && index <= 7)
    {
        returnColor ="uv-color-orange";
    }
    else if(index > 7 && index <= 10)
    {
        returnColor ="uv-color-red";
    }  
    return returnColor;
}

 var printCurrentWeather = function(data){
    //console.log("Printing icon section",data.weather[0].icon);
    var weatherIconUrl = "https://openweathermap.org/img/wn/"+data.weather[0].icon+".png";
    var getWeatherTodayEl = $(".weather-today");
    var getDate = new Date(data.dt * 1000); 
    var cityDate = city+' ('+getDate.toLocaleDateString()+') ';
    var temp = "Temp: "+data.temp;
    var wind = "Wind: "+data.wind_speed+" mph";
    var humidity = "Humidity: "+data.humidity+"%";
    var uvi = data.uvi;   

    var colorCodingUvi =getColorClass(uvi);    
    console.log(colorCodingUvi);

    var listCityEl = $("<li>")
                    .addClass("day card-item")
                    .text(cityDate);    
    var weatherImage = $("<img>")
                    .addClass("weathericon");    
    weatherImage.attr("src", weatherIconUrl);
    listCityEl.append(weatherImage);
    var tempEl = $("<li>")
                    .addClass("card-item")
                    .text(temp);
    var tempUnitEl = $("<span>")
                .html(" &#8457;");
    tempEl.append(tempUnitEl);
    var windEl = $("<li>")
                    .addClass("card-item")
                    .text(wind);
    var humidityEl = $("<li>")
                    .addClass("card-item")
                    .text(humidity);
    var uvEl = $("<li>")
                .addClass("card-item")
                .text("UV Index:");
    var spanUvEl = $("<span>")
                .addClass("uv-index")
                .addClass(colorCodingUvi)
                .text(uvi);
    uvEl.append(spanUvEl);
    
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
            var weatherIconUrl = "https://openweathermap.org/img/wn/"+current.weather[0].icon+".png";
            var getDate = new Date(current.dt * 1000);  
            
            var divCardEl = $("<div>")
                            .addClass("pure-u-1 pure-u-lg-1-5");
            
            var ulEl = $("<ul>")
                        .addClass("weatherCard");
              
            var dateEl = $("<li>")
                        .addClass("day")
                        .text(getDate.toLocaleDateString());
            var iconEl = $("<li>");
            var weatherImageEl = $("<img>").
                        addClass("weather-daily-icon");    
            weatherImageEl.attr("src", weatherIconUrl);
            iconEl.append(weatherImageEl);

            var tempEl = $("<li>")
                        .text("Temp: "+current.temp.max);
            var tempUnitEl = $("<span>")
                        .html(" &#8457;");
            tempEl.append(tempUnitEl);
            var windEl = $("<li>")
                        .text("Wind: "+current.wind_speed+" Mph");
            var humidityEl = $("<li>")
                        .text("Humidity: "+current.humidity+" %");

            ulEl.append(dateEl,iconEl, tempEl, windEl, humidityEl);
            divCardEl.append(ulEl);
            forecastEl.append(divCardEl);
        }
 }
 
 var showSearchHistory = function(){
    var cities = JSON.parse(localStorage.getItem("cities"));
    var ulEl = $('.search-history');
    ulEl.empty();
    if(cities)
    {
        for(var i=0 ; i< cities.length; i++)
        {
            var liEl = $("<li>");
            var btnEl = $("<button>")
                        .addClass("pure-button btn");
            btnEl.text(cities[i]);
            liEl.append(btnEl);
            ulEl.append(liEl);
        }
    }
 }

var showData = function(event){
    event.preventDefault();
    $(".weather-today").empty();
    $(".header-forecast").empty();
    $(".forecast").empty();

    city = $("#search").val().trim();
      
    console.log(city);

    if(city)
    {        
        getCityDetails(city);   
    }    
    $("#search").val('');

 }

 var showDataUsingHistory = function()
{
    var el = $(this);
    $(".weather-today").empty();
    $(".header-forecast").empty();
    $(".forecast").empty();
    city = el.text();
    getCityDetails(city);  
}

//Event listener for when user enters a city and clicks search
$(".search-form").submit(showData);

//Event listener for when user clicks on a previously searched city
$(".search-history").on("click","button",showDataUsingHistory);

//Show search history on page load
showSearchHistory();