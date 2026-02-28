const {Router} = require("express");
const {signUpPageGet, signUpPagePost, logInIndexPageGet, authenticateUser} = require("../controllers/indexController");
const indexRouter = Router();

indexRouter.get("/", logInIndexPageGet);

indexRouter.get("/sign-up", signUpPageGet);
indexRouter.post("/sign-up", signUpPagePost);

indexRouter.post("/log-in", authenticateUser);

module.exports = indexRouter;