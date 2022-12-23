const express = require('express');
const bodyParser = require('body-parser');
let tasks = ["Wake in the morning", "Web development", "Data structures"];
let workList = [];
const app = express();
app.set("view-engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {

    let date = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "short"
    };
    let pageTitle = date.toLocaleDateString("en-us", options);
    res.render("list.ejs", { heading: pageTitle, newTasks: tasks });


});

app.get("/work", function (req, res) {
    console.log(req.body);
    res.render("list.ejs", { heading: "Work List", newTasks: workList })
})

app.post("/", function (req, res) {
    let task = req.body.nextTask;
    if (req.body.List === "Work") {
        workList.push(task)
        res.redirect("/work")
    } else {
        console.log(task);
        tasks.push(task)
        res.redirect("/")
    }
})

app.post("/work", function (req, res) {
    let task = req.body.nextTask;
    workList.push(workItem);
    res.redirect("/work");
})



app.listen(3000, function () {
    console.log("Server is running on port 3000");
});