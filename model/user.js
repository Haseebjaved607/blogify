import { createHmac, randomBytes } from "crypto";
import { Schema, model } from "mongoose";
import { createTokenForUser, validateToken } from "../services/auth.js"

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,

    },
    password: {
        type: String,
        required: true
    },
    profileImageUrl: {
        type: String,
        default: './images/de.png'
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    },

}, { timestamps: true })

userSchema.pre("save", function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    const salt = randomBytes(16).toString('hex');
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest('hex');

    this.salt = salt;
    this.password = hashedPassword;

    next()
})

userSchema.static('matchpasswordAndgenerateToken', async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("user not found");
    const salt = user.salt
    const hashedPassword = user.password

    const userprovidedHash = createHmac('sha256', salt)
        .update(password)
        .digest('hex');

    if (hashedPassword !== userprovidedHash)
        throw new Error("Invalid Password")
    // return { ...user, password: undefined, salt: undefined }
    const token = createTokenForUser(user)
    return token;

})

const User = model('User', userSchema)

export default User;  // make it available to other parts of the application. 