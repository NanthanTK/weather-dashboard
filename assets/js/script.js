/*function to fetch cordinates of city and populate, 
store in the local storage and to 
pass coordinates to the function to populate weather info */

function getCoordinates() {
    $("#cError").empty()
    //event.preventDefault();
    console.log("hi");
    var searchData=document.getElementById('city')
    var cityValue=(searchData.value).toUpperCase();
    console.log(cityValue);
    // fetch request gets the coordinates of a number of cities for a city. The first result is used here
    var requestUrl = 'https://api.openweathermap.org/geo/1.0/direct?q= '+cityValue+'&limit=1&appid=4d0033bb108e7e87d29c289b26b71d89';
  
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.length>0){
            console.log(data)
            var lat = data[0].lat;
            var lon = data[0].lon;
            var coordData={
            city:cityValue,
            lat:lat,
            lon:lon
            }
          }else{
              $("#cError").empty();
              console.log("error");
              var cErrorEl = $("<p>").addClass("h5 p-1 bg-danger text-white text-center rounded-1 ");
              $(cErrorEl).empty();
              $(cErrorEl).text("Please enter a valid city name");
              $("#cError").append(cErrorEl);
              
              return;
          }
        //to declare variable for cityData if no past information exists
        var cityData = JSON.parse(localStorage.getItem("cityData")) || []; 
        var existingCityData = cityData.find(function(cityObj) {
          return cityObj.city === cityValue;
        });
        if (existingCityData) {
          console.log("City already exists in the local storage:", existingCityData);
        } else {
          cityData.unshift(coordData);
          //to limit the past searches stored to 8
          if (cityData.length>8){
            cityData.pop();
          }
          localStorage.setItem("cityData", JSON.stringify(cityData));
          console.log(coordData);
          $("#pSearch").empty();
          renderPage();
        }

        addWeather(lat,lon);
      });
      searchData.value=""; 
  }
  
/* function to populate weather information 
through the coordinats passed as arguments*/
function addWeather(lat,lon){
  console.log(lat,lon);
  // fetch request gets the coordinates of a number of cities for a city. The first result is used here
  var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lon+'&units=metric&cnt=5&appid=4d0033bb108e7e87d29c289b26b71d89';

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      $("#wCurrent").empty();
      $("#wForcast").empty();
      //code to populate current weather
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
      var cCityP = $("<p>").addClass("h3 ps-4").css("display","inline");
      var cImg =$('<img>')
                .attr('src', 'https://openweathermap.org/img/wn/'+iconId+'@2x.png')
                .attr("alt", "Weather Icon")
                .css({"height":"100px","display":"inline"});
      var cTempP = $("<p>").addClass("h4 ps-4")
      var cWindP = $("<p>").addClass("h4 ps-4")
      var cHumidP = $("<p>").addClass("h4 ps-4")
      $(cCityP).text(cityDis+" ("+dateDis+") ");
      $(cTempP).text("Temperature: "+ tempCur+ degreeSymbol);
      $(cWindP).text("Wind "+ wind+" m/s");
      $(cHumidP).text("Humidity: "+humidity+"%");
      $("#wCurrent").append(cCityP);
      $("#wCurrent").append(cImg)
      $("#wCurrent").append(cTempP);
      $("#wCurrent").append(cWindP);
      $("#wCurrent").append(cHumidP);
     
      //code to populate 5 day forcast
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
      $(cTempPmx).text("Max Temp: "+ tempMax+ degreeSymbol);
      $(cTempPmn).text("Min Temp: "+ tempMin+ degreeSymbol);
      $(cWindP).text("Wind "+ wind+" m/s");
      $(cHumidP).text("Humidity: "+humidity+"%");
      var wCol=$('<div>').addClass("col col-lg-2 bg-light mx-2 border border-black rounded-2");
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

//function to render page with recent searches
function renderPage(){
  var cityData = JSON.parse(localStorage.getItem("cityData"));
  if (cityData!==null){
    console.log(cityData)
        for (var i=0; i<cityData.length; i++){
        var serchP=$("<p>").addClass("h5 text-center bg-secondary text-white rounded-1 mt-1 searched");
        $(serchP).text(cityData[i].city)
        serchP.attr("data-city", cityData[i].city);
        $("#pSearch").append(serchP);
      }} 
  }

//call to render page with recent searches
renderPage();

//code to exccute search and populate weather information
var searchButton = document.getElementById('citySearch');
searchButton.addEventListener('click', getCoordinates);

//code to populate weather info from the past searches
var past = document.querySelector(".past");
past.addEventListener("click", function (event) {
var element = event.target;
  if (element.matches(".searched")) {
    var sCity = element.getAttribute("data-city");
    $("#cError").empty()
    console.log(sCity);
    var cityData = JSON.parse(localStorage.getItem("cityData"));
    //code to select the city from recent searches
    for (i=0; i<cityData.length; i++){
      if (cityData[i].city === sCity) {
        var k = i; // set the matching index
        break; // exit the loop once a match is found
      }
    }
    var lat = cityData[k].lat;
    var lon = cityData[k].lon;
    addWeather(lat,lon);
  }
});
 
