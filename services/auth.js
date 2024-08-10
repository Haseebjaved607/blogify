    import JWT from "jsonwebtoken";

    const SECRET_KEY = "Hasii!123"

    function createTokenForUser(user) {
        const payload = {
            _id: user._id,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,

        }
        const token = JWT.sign(payload, SECRET_KEY)
        return token;
    }

    function validateToken(token) {
        const payload = JWT.verify(token, SECRET_KEY)
        return payload;

    }

    export { createTokenForUser, validateToken }
