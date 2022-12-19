
const APIKey = "1dbeb6b1acf4bd3d58c4421632df6a4e";
const searchBtn = $(".search-button")
const inputSearchBox = $(".weather-search")
const cityList = $(".list-group")
const todaySection = $("#today")
ul = $("<ul>")


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
    $.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}`)
        .then(function (data) {
            createHeading(data.name)
        })
}

function createHeading(cityName) {
    let h4 = $("<h4>").text(cityName)
    todaySection.append(h4)

}

function loginPage() {
    let tempArr = getStoredData()
    getCitySearchHistory()
    if(!tempArr.length)
    createHeading("Please enter a city")
    else
    {

    }

}

