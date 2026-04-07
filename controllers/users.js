const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res) => {
    res.render("users/signup.ejs");
}

module.exports.createNewUser = (req, res, next) => {
    try {
        let {username, email, password} = req.body;
    let newUser = new User({
        email : email,
        username : username, 
    });

    User.register(newUser, password, (err, registeredUser) => {
        if(err) {
            console.log(err);
            res.send(err.message);
        } else {
        console.log(registeredUser);

        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust");
            res.redirect("/listings");
        })
        
        } });
    } 
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs");
}

module.exports.loginUser = async (req,res) => {
    req.flash("success", "Welcome to WanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req,res) => {
    console.log("logout");
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/listings");    
}