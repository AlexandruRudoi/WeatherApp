// Declaration of the variables used in the app
const express = require("express");
const https = require("https");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Getting the routes for the home page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Posting the data from the API to the page
app.post("/", (req, res) => {

    // Declaring the variables used in the API url
    const query = req.body.cityName;
    //*****************************API KEY******************************
    const apiKey = "aa";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&appid=" + apiKey;

    // Getting the data from the API
    https.get(url, (response) => {
        console.log(`Status code: ${response.statusCode}`);

        if(response.statusCode !== 200) {
            res.sendFile(__dirname + "/error.html");
        } else {
            response.on("data", (data) => {
                const weatherData = JSON.parse(data);
                const temp = Math.round(weatherData.main.temp);
                const weatherDescription = weatherData.weather[0].description;
                const weatherIcon = weatherData.weather[0].icon;
                const weatherHumidity = weatherData.main.humidity;
                const weatherWindSpeed = weatherData.wind.speed;
                const weatherPressure = weatherData.main.pressure;
                
                const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              
                res.render("weather", {
                    query: query, 
                    temp: temp, 
                    weatherDescription: weatherDescription, 
                    weatherIcon: weatherIcon, 
                    weatherHumidity: weatherHumidity, 
                    weatherWindSpeed: weatherWindSpeed, 
                    weatherPressure: weatherPressure,
                    time: time
                });
            });
        }
    });
});

app.post("/error", (req, res) => {
    res.redirect("/");
});

// Running the app on the chosen port
const port = 3000;
app.listen(process.env.PORT || port, () => {
    console.log(`Server is running on port ${port}.`);
});
