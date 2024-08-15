// user.js (Updated user router file)
import { Router } from 'express';
import User from '../model/user.js';
import { createTokenForUser } from '../services/auth.js';

const router = Router();

// Signin Route
router.get('/signin', (req, res) => {
    res.render('signin'); // renders signin.ejs
});

// Signup Route
router.get('/signup', (req, res) => {
    res.render('signup'); // renders signup.ejs
});

// Logout Route
router.get("/logout", (req, res) => {
    res.clearCookie("token").redirect("/");
});

// Signup Post Route
router.post('/signup', async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;
        const newUser = await User.create({ fullName, email, password });

        const token = createTokenForUser(newUser);
        res.cookie("token", token);
        res.redirect('/'); // Redirect to /home upon successful signup
    } catch (error) {
        next(error); // Pass error to next middleware
    }
});

// Signin Post Route
router.post('/signin', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).send("Email and password are required");
        }

        const token = await User.matchPasswordAndGenerateToken(email, password);

        if (!token) {
            return res.status(401).send("Invalid email or password");
        }

        res.cookie("token", token);
        res.redirect('/'); // Redirect to /home upon successful signin
    } catch (error) {
        return res.render("signin", {
            error: "Invalid email or password"
        });
    }
});

export default router;
