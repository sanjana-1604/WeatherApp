
const APIKey = "1dbeb6b1acf4bd3d58c4421632df6a4e";
const searchBtn = $(".search-button")
const inputSearchBox = $(".weather-search")
const cityList = $(".list-group")
const todaySection = $("#today")
const forecastSection = $("#forecast")
ul = $("<ul>")
let longitude;
let latitude;


function getStoredData() {
    let tempArr = []
    let cityHistoryArr = localStorage.getItem("city")

    if (cityHistoryArr) {
        tempArr = cityHistoryArr.split(",")
    }
    return tempArr
}


/*FUnction to display city search history */
function getCitySearchHistory() {
    let li
    let tempArr = getStoredData()
    if (tempArr.length) {
        for (city of tempArr) {
            li = $('<li>').text(city)
            li.addClass("list-group-item")
            ul.append(li)
        }
        cityList.append(ul)
    }
}

/* Call this function to create initial screen*/
loginPage()



//Search button click handled here
searchBtn.click(function (event) {
    event.preventDefault()
    getCityLonLat(inputSearchBox.val().toLowerCase())
})

//This function create first entry for the city list
function initScreen(cityName) {
    let li
    li = $('<li>').text(cityName)
    li.addClass("list-group-item")
    ul.append(li)
    cityList.append(ul)
}

/*This function takes city name from input and pass Longitude and Latitude to find weather conditions */
function getCityLonLat(cityName) {

    let tempArr = getStoredData()
    let cityArr = []
    $.get(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${APIKey}`)
        .then(function (data) {
            if (data.length) {

                if (!tempArr.length) {
                    tempArr.push(cityName)
                    cityArr = tempArr
                }
                else {
                    if (!tempArr.includes(cityName)) {
                        for (city of tempArr) {
                            cityArr.push(city)
                        }
                        cityArr.push(cityName)
                    }
                }
                if (cityArr.length) {
                    localStorage.setItem("city", cityArr)
                    initScreen(cityName)
                }
                inputSearchBox.val("")
                longitude = data[0].lon
                latitude = data[0].lat

                getCityWeather(data[0].lon, data[0].lat)
              
            }
            else {
                alert("Please enter valid city name")
                inputSearchBox.val("")
            }
        })
}



/* Function to get weather conditions using longitude and Latitude */
function getCityWeather(lon, lat) {
    $.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${APIKey}`)
        .then(function (data) {
            clearForecastSection()
            createForecastSection(data, "todayForecast")
        })
}


function loginPage() {

    let tempArr = getStoredData()

    getCitySearchHistory()
    if (!tempArr.length) {
        let h4 = $("<h4>")
        h4.text("Please enter city to search")
        todaySection.append(h4)
    }
    else {

        getCityLonLat(tempArr[0])

    }
    
}
function forecastSectionCreation() {
   

    $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${APIKey}`)
        .then(function (data) {   
            console.log(data, data.list[0], data.list[4], data.list[7])   

            }
            
        )

}


function createForecastSection(data, position) {
    let todayDate = $("<h4>")
    let forcastImg = $("<img>")
    let tempP = $("<p>")
    let humidityP = $("<p>")
    let windP = $("<p>")
    let date = moment().format('DD/MM/YYYY')
    forcastImg.attr('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`)
    todayDate.text(`(${date})`)
    let tempInCelsius = Math.ceil(data.main.temp)
    let windSpeed = (data.wind.speed * 2.23694).toFixed(1)
    tempP.text(`Temp: ${tempInCelsius}\xB0C`)
    windP.text(`Wind: ${windSpeed} KPH`)
    humidityP.text(`Humidity: ${data.main.humidity}%`)


    if (position == "todayForecast") {
        let h4 = $("<h4>")
        h4.addClass("locationName")
        h4.text(data.name)
        todaySection.append(h4)
        todayDate.addClass("todayDate")
        todaySection.append(todayDate)
        todaySection.append(tempP)       
        todaySection.append(windP)
        todaySection.append(humidityP)     

    }
}

function clearForecastSection()
{
    todaySection.empty()
    forecastSection.empty()
}
