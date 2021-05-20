const express = require("express");

const router = express.Router();
const { insertUser, getUserByEmail } = require('../model/user/User.model');
const { hashPassword, comparePassword } = require('../helpers/bcrypt.helper');
const { createAccessJWT, createRefershJWT } = require('../helpers/jwt.helper');

router.all('/', (req, res, next) => {
    // res.json({ message: "return from user router" });

    next();
});

router.post("/", async (req, res) => {

    const { name, company, address, phone, email, password } = req.body;

    try {
        //hash password
        const hashedPass = await hashPassword(password);

        const newUserObj = {
            name,
            company,
            address,
            phone,
            email,
            password: hashedPass
        }
        const result = await insertUser(newUserObj)
        console.log(req.body);
        res.json({ message: 'New user created', result })
    } catch (error) {
        console.log(error);
        res.json({ status: 'error', message: error.message })
    }

})

//Create sign in Router

router.post("/login", async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {

        return res.json({ status: "error", message: "Invalid submission" })
    }

    const user = await getUserByEmail(email)

    const passFromDb = user && user._id ? user.password : null;

    if (!passFromDb) {
        return res.json({ status: "error", message: "Invalid email or password" });

    }



    const result = await comparePassword(password, passFromDb);


    if (result) {
        const accessJWT = await createAccessJWT(user.email);
        const refreshJWT = await createRefershJWT(user.email);

        res.json({
            status: "success", message: "Login successfully",
            accessJWT,
            refreshJWT
        })
    }
    console.log(result);


})

module.exports = router; 