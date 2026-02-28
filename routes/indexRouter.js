const {Router} = require("express");
const {signUpPageGet, signUpPagePost} = require("../controllers/indexController");
const indexRouter = Router();

indexRouter.get("/sign-up", signUpPageGet);
indexRouter.post("/sign-up", signUpPagePost);

module.exports = indexRouter;