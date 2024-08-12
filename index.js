import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import router from './routes/user.js';
import blogRouter from './routes/blog.js';
import cookieParser from 'cookie-parser';
import { checkForAuthenticationCookie } from './middlewares/auth.js';
import Blog from './model/blog.js';

const app = express();
const PORT = 5000;

// MongoDB connection
mongoose.connect("mongodb+srv://lucyfar206:KHTmLBAnbpZNzOe7@cluster0.fclwpgs.mongodb.net/")
    .then(() => console.log("Connected to MongoDB!"))
    .catch(err => console.log(err));

// View engine setup
app.set('view engine', 'ejs');
app.set("views", path.resolve("./views"));

// Middleware setup
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public')));

// Routes
app.get("/", async (req, res) => {
    try {
        const allBlogs = await Blog.find({});
        res.render('home', {
            user: req.user,
            blogs: allBlogs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.get("/home", (req, res) => {
    res.render('home', {
        user: req.user
    });
});

app.use("/user", router);
app.use("/blog", blogRouter);

// Start server
app.listen(PORT, () => console.log(`Serving on port ${PORT}`));
