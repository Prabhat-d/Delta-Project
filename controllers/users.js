const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res) => {
    return res.render("users/signup.ejs");
}

module.exports.createNewUser = async (req, res, next) => {
    try {
        let {username, email, password} = req.body;
        let newUser = new User({ email, username });

        User.register(newUser, password, (err, registeredUser) => {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("/signup");
            }

            req.login(registeredUser, (err) => {
                if (err) {
                    return next(err);
                }
                req.flash("success", `Welcome to Roamly, ${registeredUser.username}!`);
                return res.redirect("/listings");
            });
        });
    } catch (e) {
        req.flash("error", e.message);
        return res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req,res) => {
    return res.render("users/login.ejs");
}

module.exports.loginUser = async (req,res) => {
    req.flash("success", `Welcome back, ${req.user.username}!`);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req,res) => {
    console.log("logout");
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/listings");    
}