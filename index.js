import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import router from './routes/user.js';
import cookieParser from 'cookie-parser';
import { checkForAuthenticationCookie } from './middlewares/auth.js';

const app = express();
const PORT = 5000;

mongoose.connect("mongodb+srv://lucyfar206:KHTmLBAnbpZNzOe7@cluster0.fclwpgs.mongodb.net/")
    .then(() => {
        console.log("Connected to MongoDB!");
    })
    .catch(err => console.log(err));

app.set('view engine', 'ejs');
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));

app.get("/", (req, res) => {
    res.render('home', {
        user: req.user, // Pass req.user to the template
    });
});

app.get("/home", (req, res) => {
    res.render('home', {
        user: req.user, // Pass req.user to the template
    });
});

app.use("/user", router);

app.listen(PORT, () => console.log(`Serving on port ${PORT}`));
