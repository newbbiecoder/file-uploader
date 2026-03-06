const {Router} = require("express");
const {signUpPageGet, signUpPagePost, logInIndexPageGet, authenticateUser, logOutGet} = require("../controllers/indexController");
const indexRouter = Router();

indexRouter.get("/", logInIndexPageGet);

indexRouter.get("/sign-up", signUpPageGet);
indexRouter.post("/sign-up", signUpPagePost);

indexRouter.post("/log-in", authenticateUser);

indexRouter.get("/log-out", logOutGet)

module.exports = indexRouter;