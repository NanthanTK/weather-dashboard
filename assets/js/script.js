//fetch cordinates of city
var searchButton = document.getElementById('citySearch');

function getCoordinates() {
    
    event.preventDefault();
    console.log("hi");
    var searchData=document.getElementById('city')
    var cityValue=(searchData.value).toUpperCase();
    console.log(cityValue);
    // fetch request gets the coordinates of a number of cities for a city. The first result is used here
    var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q= '+cityValue+'&limit=1&appid=4d0033bb108e7e87d29c289b26b71d89';
  
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data)
        var lat = data[0].lat;
        var lon = data[0].lon;
        var coordData={
            city:cityValue,
            lat:lat,
            lon:lon
        }
        var cityData = JSON.parse(localStorage.getItem("cityData")) || []; 
       
        var existingCityData = cityData.find(function(cityObj) {
          return cityObj.city === cityValue;
        });
        
        if (existingCityData) {
          console.log("City already exists in the local storage:", existingCityData);
        } else {
          cityData.unshift(coordData);
          localStorage.setItem("cityData", JSON.stringify(cityData));
          console.log(coordData);
          //addWeather(lat,lon);
        }

        //cityData.unshift(coordData);
        //localStorage.setItem("cityData", JSON.stringify(cityData));
        //console.log(coordData);
        addWeather(lat,lon);
      });
  }
  

function addWeather(lat,lon){
  //event.preventDefault();
  console.log("hi2");
  
  console.log(lat,lon);
  // fetch request gets the coordinates of a number of cities for a city. The first result is used here
  var requestUrl = 'http://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lon+'&units=metric&cnt=5&appid=4d0033bb108e7e87d29c289b26b71d89';

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      $("#wCurrent").empty();
      $("#wForcast").empty();
      var i=0
      var cityDis=data.city.name;
      var wArray=data.list;
      var dateDis = dayjs.unix((wArray[i].dt)).format("DD/MM/YYYY")
      var iconId=wArray[i].weather[0].icon;
      var degreeSymbol = '\u00B0C';
      var tempCur=wArray[i].main.temp;
      var tempMax=wArray[i].main.temp_max;
      var tempMin=wArray[i].main.temp_min;
      var humidity=wArray[i].main.humidity;
      var wind=wArray[i].wind.speed;
      var cCityP = $("<p>").addClass("h3").css("display","inline");
      var cImg =$('<img>')
                .attr('src', 'https://openweathermap.org/img/wn/'+iconId+'@2x.png')
                .attr("alt", "Weather Icon")
                .css({"height":"100px","display":"inline"});
      var cTempP = $("<p>").addClass("h4")
      var cWindP = $("<p>").addClass("h4")
      var cHumidP = $("<p>").addClass("h4")
      $(cCityP).text(cityDis+" ("+dateDis+") ");
      $(cTempP).text("Temp: "+ tempCur+ degreeSymbol);
      $(cWindP).text("Wind "+ wind+" m/s");
      $(cHumidP).text("Humidity: "+humidity+"%");
      $("#wCurrent").append(cCityP);
      $("#wCurrent").append(cImg)
      $("#wCurrent").append(cTempP);
      $("#wCurrent").append(cWindP);
      $("#wCurrent").append(cHumidP);

      
      for (var i=0; i<wArray.length; i++){
      var iconId=wArray[i].weather[0].icon;
      var degreeSymbol = '\u00B0C';
      var tempCur=wArray[i].main.temp;
      var tempMax=wArray[i].main.temp_max;
      var tempMin=wArray[i].main.temp_min;
      var humidity=wArray[i].main.humidity;
      var wind=wArray[i].wind.speed;
      var cCityP = $("<p>").addClass("h5").css("display","inline");
      var cImg =$('<img>')
                .attr('src', 'https://openweathermap.org/img/wn/'+iconId+'@2x.png')
                .attr("alt", "Weather Icon")
                .css({"height":"100px","display":"inline"});
      var cTempPmx = $("<p>").addClass("h6")
      var cTempPmn = $("<p>").addClass("h6")
      var cWindP = $("<p>").addClass("h6")
      var cHumidP = $("<p>").addClass("h6")
      $(cCityP).text(dateDis);
      $(cTempPmx).text("Temp: "+ tempMax+ degreeSymbol);
      $(cTempPmn).text("Temp: "+ tempMin+ degreeSymbol);
      $(cWindP).text("Wind "+ wind+" m/s");
      $(cHumidP).text("Humidity: "+humidity+"%");
      var wCol=$('<div>').addClass("col col-lg-2 bg-light mx-2 border border-black ");
      $("#wForcast").append(wCol)
      $(wCol).append(cCityP);
      $(wCol).append(cImg)
      $(wCol).append(cTempPmx);
      $(wCol).append(cTempPmn);
      $(wCol).append(cWindP);
      $(wCol).append(cHumidP);
      }
    });
}

function renderPage(){
  var cityData = JSON.parse(localStorage.getItem("cityData"));
  if (cityData!==null){
    console.log(cityData)
        for (var i=0; i<cityData.length; i++){
        var serchP=$("<p>").addClass("h4 bg-secondary");
        $(serchP).text(cityData[i].city)
        serchP.data("city", cityData[i].city); 
        $("#pSearch").append(serchP);
      }}
 
  }
  
renderPage();


  searchButton.addEventListener('click', getCoordinates);
  //addWeather(6.9387469,79.8541134);
  /* 
  check for saved data
  if yes 
    get city data from local storage 
    populate past search cities
    return
  await click
  if click is from search
    get city and pass to getCoordinates function
    store city and coordinates to local storage data
    pass info to function to populate weather
    
  else if from past searches 
    select stored data from local storage
     pass info to function to populate weather
    
  weather app
  fetch weather data from API 
  populate todays weather
  populate 5 day forcast
  return
  */
 