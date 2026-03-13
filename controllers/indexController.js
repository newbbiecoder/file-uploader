const pool = require("../config/pool");
const bcrypt = require("bcryptjs");
const {body, validationResult, matchedData} = require("express-validator");
const passport = require("passport");

const fileArr = [];

async function logInIndexPageGet(req, res, next) {
    try {
        const {rows} = await pool.query(`
            SELECT "id", "originalName", "size", TO_CHAR(date, 'DD/MM/YYYY') as date, "userId"
            FROM "Files"
        `);

        res.render("index", {
            user: req.user,
            files: rows
        });
    } catch(err) {
        return next(err);
    }
}

async function uploadFilePost(req, res, next) {
    try {
        if (req.file) {
            console.log(req.file);
            await pool.query(`
                INSERT INTO "Files" ("originalName", "size", "userId") VALUES($1, $2, $3)
            `, [req.file.originalname, req.file.size, req.user.id])
        }
        res.redirect("/"); 
    } catch (err) {
        return next(err);
    }
}

async function authenticateUser(req, res, next) {
    try {
        passport.authenticate("local", function(err, user, info) {
            if(err) {return next(err)}
            if(!user) {
                return res.render('index', {
                    title: "HomePage",
                    user: req.user,
                    errMessage: info.message
                })
            }
            req.logIn(user, function(err) {
                if(err) return next(err);
                return res.redirect('/')
            })
        })(req, res, next)
    } catch(err) {
        return next(err);
    }
}

function signUpPageGet(req, res, next) {
    try {
        res.render("sign-up-form", {
            title: "Sign Up"
        })
    } catch(err) {
        return next(err);
    }
}

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";

const validateUser = [
    body("firstName").trim()
    .isAlpha().withMessage(`First Name ${alphaErr}`)
    .isLength({min: 1, max: 10}).withMessage(`First Name ${lengthErr}`),

    body("lastName").trim()
    .isAlpha().withMessage(`Last Name ${alphaErr}`)
    .isLength({min: 1, max: 10}).withMessage(`Last Name ${lengthErr}`),

    body("password").trim().isLength({min: 6, max: 25}).withMessage("Password should be atleast 6 characters long"),

    body("username").trim()
    .isLength({min: 1, max: 10}).withMessage(`Username ${lengthErr}`),
]

let signUpPagePost = [
    validateUser,
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).render("sign-up-form", {
                    title: "Sign Up",
                    errors: errors.array(),
                });
            }
            const {password} = matchedData(req);
            const hashedPassword = await bcrypt.hash(password, 10);
            
            await pool.query('INSERT INTO "Users" (username, fullname, password) VALUES ($1, $2, $3)', [
                req.body.username,
                req.body.firstName + " " + req.body.lastName,
                hashedPassword
            ])
            res.redirect("/");
        }
        catch(err) {
            return next(err);
        }
    }
]

function logOutGet(req, res, next) {
    try {
        req.logOut((err) => {
            if(err) {
                return next(err);
            }
            res.redirect("/");
        })
    } catch(err) {
        return next(err);
    }
}

module.exports = {
    logInIndexPageGet,
    authenticateUser,
    signUpPageGet,
    signUpPagePost,
    uploadFilePost,
    logOutGet,
}