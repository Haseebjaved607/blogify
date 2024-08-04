import { Router } from 'express';
import User from '../model/user.js';

const router = Router();

router.get('/signin', (req, res) => {
    res.render('signin'); // renders signin.ejs
});

router.get('/signup', (req, res) => {
    res.render('signup'); // renders signup.ejs
});

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
    try {
        const { email, password } = req.body;
        const user = await User.matchpassword(email, password);
        // console.log("User", user);

        res.redirect('/home'); // redirect to /home upon successful signin
    } catch (error) {
        next(error); // pass error to next middleware
    }
});

export default router;
