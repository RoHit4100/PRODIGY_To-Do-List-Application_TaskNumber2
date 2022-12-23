const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.set("view-engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    let date = new Date();
    let today = date.getDate();
    let day = "";
    if (today === 0 || today === 6) {
        day = "Weekend";
    } else {
        day = "weekday"
    }
    res.render("list.ejs", { kindOfDay: day });
});

app.listen(3000, function () {
    console.log("Server is running on port 3000");
});