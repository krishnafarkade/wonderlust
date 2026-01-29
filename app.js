if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const ExpressError = require ("./utils/ExpressError.js")
const path = require("path")
var methodOverride = require('method-override')
const engine = require('ejs-mate');

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const usersRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');

const passport = require("passport");
const LocalStrategy= require ("passport-local")
const User = require('./models/user.js');

const flash = require("connect-flash");

app.use(methodOverride('_method'))
app.engine('ejs', engine);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"/public")));

// const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";
const dbUrl = process.env.ATLASDB_URL;


async function main() {
  await mongoose.connect(dbUrl);
  console.log("MongoDB Connected");
}

main()
  .then(() => {
    app.listen(8080, () => {
      console.log("Server running on port 8080");
    });
  })
  .catch(err => {
    console.log("MongoDB connection error", err);
  });


// app.get("/",(req,res)=>{
//    res.send("connect to root");
// });

// const store = MongoStore.create({
//   mongoUrl : dbUrl,
//   crypto: {
//     secret : 'mysupersecretcode'
//   },
//   touchAfter : 24*3600
// })  
// store.on("error",()=>{
//   console.log("ERROR IN MONGO SESSION",err)
// })

let sessionOption = {
  // store,
  secret : process.env.SECRET,
  resave : false,
  saveUninitialized : true,
  cookie : {
  expires : Date.now()+7*24 * 60 * 60 *1000,
  maxAge : 7 * 24 *60 * 60 *1000,
  httpOnly : true
  },
} 

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
   res.locals.success= req.flash("success");
   res.locals.error= req.flash("error");
   res.locals.currUser = req.user;
   next();
});


// app.use("/demouser",async(req,res)=>{

//   let fakeUser = new User({
//     email : "krishna@gmailcom",
//     username : "sigma-student",
// });

// let registerUser=await User.register(fakeUser,"helloWorld");
// res.send(registerUser);
// })

app.use("/listing",listingsRouter);
app.use("/listing/:id/reviews", reviewsRouter);
app.use("/",usersRouter);


//middlewares
app.use((req, res, next) => {
    throw new ExpressError(404,"Page Not Found")
    
});
app.use((err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong";

  if (typeof err === "object" && err !== null) {
    statusCode = typeof err.statusCode === "number" ? err.statusCode : 500;
    message = err.message || "Something went wrong";
  } else if (typeof err === "string") {
    message = err;
  }
  res.status(statusCode).render("listings/error.ejs", { statusCode, message });
});


app.listen(8080,(req,res)=>{
    console.log("app is listening on 8080 ");
})