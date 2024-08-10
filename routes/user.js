import { Router } from 'express';
import User from '../model/user.js';
import { createTokenForUser } from '../services/auth.js';

const router = Router();

router.get('/signin', (req, res) => {
    res.render('signin'); // renders signin.ejs
});

router.get('/signup', (req, res) => {
    res.render('signup'); // renders signup.ejs
});

router.get("/logout", (req , res )=>{
    res.clearCookie("token").redirect("/home")
})

router.post('/signup', async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;
        await User.create({ fullName, email, password });
        res.redirect('/home'); // redirect to /home upon successful signup
    } catch (error) {
        next(error); // pass error to next middleware
    }
});

router.post('/signin', async (req, res, next) => {

    const { email, password } = req.body;
    try {

        if (!email || !password) {
            return res.status(400).send("Email and password are required");
        }

        const token = await User.matchpasswordAndgenerateToken(email, password);

        return res.cookie("token", token).redirect('/home'); // redirect to /home upon successful signin
    } catch (error) {
        return res.render("signin", {
            error: "Invalid email or password"
        })

    }
});

export default router;
