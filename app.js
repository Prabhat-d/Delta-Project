if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
//const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const port = process.env.PORT || 8080;

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.set("view engine", "ejs"); //view engine or views engine? ...
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const MONGO_URL = process.env.ATLASDB_URL;

if (!MONGO_URL) {
  throw new Error("ATLASDB_URL is not defined in your .env file");
}


main()
  .then(() => {
    console.log("connection success");
  })
  .catch((e) => {
    console.log(e);
  });

// async function main() {
//   await mongoose.connect(MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
// }
async function main() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("connection success");

  // 🔥 Create store AFTER connection
  // const store = MongoStore.create({
  //   mongoUrl: MONGO_URL,
  //   crypto: {
  //     secret: process.env.SECRET,
  //   },
  // });

  // store.on("error", (e) => {
  //   console.log("SESSION STORE ERROR", e);
  // });

  app.set("trust proxy", 1);

  app.use(
    session({
      // store: store,
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure:  process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite:  process.env.NODE_ENV === "production" ? "none" : "lax",
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      },
    }),
  );

  app.use(flash());

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  app.use((req, res, next) => {
    res.locals.success = req.flash("success") || [];
    res.locals.error = req.flash("error") || [];
    res.locals.currUser = req.user || null;
    next();
  });

  app.use("/listings", listingRouter);
  app.use("/listings/:id/reviews", reviewRouter);
  app.use("/", userRouter);

  app.get("/", (req, res) => {
    res.redirect("/listings");
  });

  // 🔥 START SERVER ONLY AFTER EVERYTHING READY
  app.listen(port, () => {
    console.log("app is listening on port 8080");
  });

  app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found :("));
  });
  app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err); // 🔥 VERY IMPORTANT
  }

  if (err.message && err.message.includes("File size too large")) {
    req.flash("error", "Image is too large. Please upload a file under 10 MB.");
    return res.redirect("back");
  }

  let { statusCode = 500, message = "Something Went Wrong" } = err;

  res.status(statusCode).render("error.ejs", { message });
});
}
