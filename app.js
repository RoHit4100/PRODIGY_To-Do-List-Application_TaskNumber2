const express = require('express');
const bodyParser = require('body-parser');
let tasks = ["Wake in the morning", "Web development", "Data structures"];


const app = express();
app.set("view-engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    let date = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "short"
    };

    let formatDay = date.toLocaleDateString("en-us", options);
    res.render("list.ejs", { kindOfDay: formatDay, newTasks: tasks });
});

app.post("/", function (req, res) {
    let task = req.body.nextTask;
    tasks.push(task);

    res.redirect("/");
})

app.listen(3000, function () {
    console.log("Server is running on port 3000");
});