const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');
const app = express();
app.use(express.static("public"));

app.set("view-engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

main().catch(err => console.log(err));
async function main() {
    mongoose.set('strictQuery', true);
    await mongoose.connect('mongodb+srv://admin-rohit:rohit4934@cluster0.pzqkwyo.mongodb.net/todoDb');
}

const itemSchema = {
    name: String
}
const Item = new mongoose.model("Item", itemSchema);
const item1 = new Item({
    name: "Welcome to my to do list!"
})
const item2 = new Item({
    name: "Here You can add your daily tasks and be consistent!"
})
const item3 = new Item({
    name: "<<-- Click here to delete the tasks!"
})
const defaultItems = [item1, item2, item3];

const newListSchema = mongoose.Schema({
    name: String,
    defaultList: [itemSchema]
});

const List = new mongoose.model("List", newListSchema);

app.get("/", function (req, res) {
    Item.find(function (err, items) {
        if (!err) {
            if (items.length === 0) {
                Item.insertMany(defaultItems, function (err) {
                    if (!err) {
                        console.log("Successfully added to the DB");
                        res.redirect("/")
                    }
                })
            } else {
                res.render("list.ejs", { heading: "Today", items: items });
            }
        }
    })
});


app.get("/:userDefineList", function (req, res) {
    const newTitle = _.capitalize(req.params.userDefineList);
    List.findOne({ name: newTitle }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: newTitle,
                    defaultList: defaultItems
                });
                list.save();
                res.redirect("/" + newTitle)
            } else {
                res.render("list.ejs", { heading: foundList.name, items: foundList.defaultList });
            }
        }
    })
    // console.log(list);
})

app.post("/", function (req, res) {
    const itemName = req.body.nextItem;
    const listName = req.body.button;
    const item = new Item({
        name: itemName
    });
    if (listName === "Today") {
        item.save();
        res.redirect("/")
    } else {
        List.findOne({ name: listName }, function (err, foundItem) {
            foundItem.defaultList.push(item);
            foundItem.save();
            res.redirect("/" + listName);
        })
    }
})

app.post("/delete", function (req, res) {
    let checkedId = req.body.checkBox;
    checkedId = checkedId.trim();
    let listName = req.body.listName;
    listName = listName.trim();
    console.log(listName);
    if (listName === "Today") {
        Item.findByIdAndRemove({ _id: checkedId }, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("success");
                res.redirect("/")
            }
        })
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { defaultList: { _id: checkedId } } }, function (err) {
            if (!err) {
                res.redirect("/" + listName);
            }
        })
    }

})


app.listen(3000, function () {
    console.log("Server is running on port 3000\n");
});