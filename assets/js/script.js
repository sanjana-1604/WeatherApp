
const APIKey = "1dbeb6b1acf4bd3d58c4421632df6a4e";
let cityArr = []
let cityHistoryArr = localStorage.getItem("city")
const searchBtn = $(".search-button")
const inputSearchBox = $(".weather-search")
const cityList = $(".list-group")
const todaySection = $("#today")
ul = $("<ul>")


function getStoredData()
{
    
}


/*FUnction to display city search history */
function getCitySearchHistory() {
    let li    
    let tempArr = []

    if (cityHistoryArr) {
        tempArr = cityHistoryArr.split(",")
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
    getCityLonLat(inputSearchBox.val())
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
    let tempArr = []
   
    $.get(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${APIKey}`)
        .then(function (data) {

            if (data.length) {
              //  let cityHistoryArr = localStorage.getItem("city")
console.log(cityHistoryArr)
                if (!cityHistoryArr) {
                    tempArr.push(cityName)
                }
                else {
                    cityArr = cityHistoryArr.split(",")

                    if (!cityArr.includes(cityName)) {                       
                        for (city of cityArr) {
                            tempArr.push(city)
                        }
                        tempArr.push(cityName)
                    }
                }
                if (tempArr.length) {
                   
                    localStorage.setItem("city", tempArr)
                    cityHistoryArr = localStorage.getItem("city")
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

function loginPage()
{
    getCitySearchHistory()
    if(!cityHistoryArr)
    createHeading("Please enter a city")
    else
    {

    }

}

