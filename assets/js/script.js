
const APIKey = "1dbeb6b1acf4bd3d58c4421632df6a4e";

const searchBtn = $(".search-button")
const inputSearchBox = $(".weather-search")
const cityList = $(".list-group")
const todaySection = $("#today")
const forecastSection = $("#forecast")

let longitude;
let latitude;
let tempArr = []

//FUnction to get city list from local storage
function getStoredCityList() {
    let cityHistoryArr = localStorage.getItem("city")
    if (cityHistoryArr) {
        tempArr = cityHistoryArr.split(",")
    }
}


/*FUnction to display city list */
function createCityList() {
    let li
    let ul = $("<ul>")
    cityList.empty()
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
    getCityWeatherData(inputSearchBox.val().toLowerCase())
})

//list click handler
cityList.delegate("li", "click", function (event) {
    let cityName = $(this)[0].innerText
    getCityWeatherData(cityName)
})



/*This function takes city name from input and pass Longitude and Latitude to find weather conditions */
function getCityWeatherData(cityName) {

    $.get(`https://api.openweathermap.org/data/2.5/weather?appid=${APIKey}&units=metric&q=${cityName}`)
        .then(function (data) {
           
            if (data) {
                if (!tempArr.length) {
                    tempArr.push(cityName)
                }
                else {
                    if (!tempArr.includes(cityName)) {
                        tempArr.push(cityName)
                    }
                }
                localStorage.setItem("city", tempArr)
                createCityList()
                inputSearchBox.val("")
                longitude = data.coord.lon
                latitude = data.coord.lat
                let tempObj = createForecastSection(data, "todayForecast")
                currentForecast(tempObj)
               // get5DaysForecastData()


            }
            else {
                alert("Please enter valid city name")
                inputSearchBox.val("")
            }
        })
}

//Function to create initial screen
function loginPage() {
    getStoredCityList()
    createCityList()
    if (!tempArr.length) {
        let h4 = $("<h4>")
        h4.text("Please enter city to search")
        todaySection.append(h4)
    }
    else {
        getCityWeatherData(tempArr[0])
    }

}
//FUnction to get 5 days data from server
function get5DaysForecastData() {

    $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${APIKey}`)
        .then(function (data) {
          //  console.log(data, data.list[0], data.list[4], data.list[7])
            for (var i = 0; i < 5; i++) {
                for (var j = 0; j < 3; j++) {
                    forecast5days(createForecastSection(data.list[0], ""))
                }
            }
        }
        )

}

//Function to create today's forecast and 5 days forecast sections
function createForecastSection(data, position) {
    let todayDate = $("<h4>")
    let forcastImg = $("<img>")
    let tempP = $("<p>")
    let humidityP = $("<p>")
    let windP = $("<p>")

    let date = moment().format('DD/MM/YYYY')
    forcastImg.attr('src', `https://openweathermap.org/img/w/${data.weather[0].icon}.png`)
    todayDate.text(`(${date})`)
    let tempInCelsius = Math.ceil(data.main.temp)
    let windSpeed = (data.wind.speed * 2.23694).toFixed(1)
    tempP.text(`Temp: ${tempInCelsius}\xB0C`)
    windP.text(`Wind: ${windSpeed} KPH`)
    humidityP.text(`Humidity: ${data.main.humidity}%`)

    todaySection.empty()
    forecastSection.empty()
    if (position === "todayForecast") {
        let h4 = $("<h4>")
        h4.addClass("locationName")
        h4.text(data.name)
        todaySection.append(h4)
        todayDate.addClass("todayDate")

    }
    
    return { "date": todayDate, "Img": forcastImg, "temp": tempP, "humidity": humidityP, "wind": windP }

}


function currentForecast(obj) {
    todaySection.append(obj.todayDate)
    todaySection.append(obj.Img)
 
    todaySection.append(obj.temp)
    todaySection.append(obj.wind)
    todaySection.append(obj.humidity)

}

function forecast5days(obj)
{
    let div = $("<div>")
    div.addClass("forecast5Section")
    div.append(obj.todayDate)
    div.append(obj.Img)    
    div.append(obj.temp)
    div.append(obj.wind)
    div.append(obj.humidity)


    forecastSection.append(div)
    
}

