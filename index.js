import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import router from './routes/user.js';

const app = express();
const PORT = 5000;

mongoose.connect("mongodb+srv://lucyfar206:KHTmLBAnbpZNzOe7@cluster0.fclwpgs.mongodb.net/")
    .then(() => {
        console.log("Connected to MongoDB!");
    })
    .catch(err => console.log(err)); // added catch to handle connection error

app.set('view engine', 'ejs');
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.render('home'); // default route to render home.ejs
});

app.get("/home", (req, res) => {
    res.render('home'); // explicitly handle /home route
});

app.use("/user", router);

app.listen(PORT, () => console.log(`Serving on port ${PORT}`));
