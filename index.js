import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API = "yourapikey";
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


var myHeaders = {
    "x-access-token": "yourtoken",
    "Content-Type": "application/json",
};



var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};


let lat;
let lon;
let uvIndex;
let message;

app.get("/", (req, res) => {
    res.render("index.ejs");
});


app.post("/getUV", async (req, res) => {
    const city = req.body.city;
    try {
        const result = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API}`);
   
        lat = result.data[0].lat;
        lon = result.data[0].lon;
    
    } catch(error) {
        console.log(error.message);
    };

    try {
        const result = await axios.get(`https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lon}`, requestOptions);
        uvIndex = result.data.result.uv;
        if (uvIndex > 5) {
            message = "You should wear sunscreen";
        } else {
            message = "It's okay if you don't wear sunscreen";
        }
        res.render("uv.ejs", {uv: uvIndex, message: message});
    } catch(error) {
        console.log(error.message);
    };

});


app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});