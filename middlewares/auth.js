import { validateToken } from '../services/auth.js';

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if (!tokenCookieValue) {
            return next(); // Proceed if no cookie is found
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload; // Set req.user if token is valid
        } catch (error) {
            res.clearCookie(cookieName); // Optional: clear invalid token cookie
            return res.status(401).send("Invalid token"); // Stop processing if token is invalid
        }

        return next(); // Proceed if everything is fine
    };
}

export { checkForAuthenticationCookie , };
