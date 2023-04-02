const { signupUserByEmail } = require("../services/user.service");
const Router = require("express").Router();

Router.post("/signup-email", async (req, res) => {
    try {
        const payload = await signupUserByEmail(req.body,res);
    } catch (error) {
        console.log(error)
    }
})
module.exports = Router;