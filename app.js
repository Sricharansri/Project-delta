const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/reviews.js");
const router = express.Router();
const session = require("express-session");
const flash = require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local").Strategy;
const User=require("./models/user.js");
const {isLoggedIn, saveRedirectUrl,isOwner,validatelisting,validateReview,isReviewauthor}=require("./middleware.js");
const ListingController=require("./controller/listings.js")
const ReviewController=require("./controller/reviews.js")
const loginController=require("./controller/users.js")
const MongoStore=require("connect-mongo");


require("dotenv").config();
const dburl=process.env.ATLASDB_URL;
const store=MongoStore.create({
  mongoUrl:dburl,
  crypto:{
secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});
store.on("error",()=>{
  console.log("Error in mongo");
});
const sessionoptions = {
  store,
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionoptions));
app.use(passport.initialize());
app.use(passport.session()); // Initialize session first
app.use(flash()); // Initialize flash after session
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser=req.user;
  next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//const mongourl = "mongodb://127.0.0.1:27017/wanderlust";




main()
  .then(() => {
    console.log("connection is successful");
  })
  .catch((err) => {
    console.log("error");
  });

async function main() {
  await mongoose.connect(dburl);
}

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, 'intit')));
app.use(express.static(path.join(__dirname, "/public")));









// Show all listings
app.get("/listings", wrapAsync(ListingController.index));

// Create new listing (GET)
app.get("/listings/new",isLoggedIn,ListingController.rendernewform);

// Create new listing (POST)
app.post("/listings",isLoggedIn,validatelisting,wrapAsync(ListingController.createListing ));

// Edit listing (GET)
app.get("/listings/:id/edit",isLoggedIn,isOwner, wrapAsync(ListingController.editListing));

// Update listing (PUT)
app.put("/listings/:id",isLoggedIn,isOwner, validatelisting, wrapAsync(ListingController.updateListing));

// Delete listing (DELETE)
app.delete("/listings/:id",isLoggedIn,isOwner, wrapAsync(ListingController.destory));

// Show individual listing (GET)
app.get("/listings/:id", wrapAsync(ListingController.showListing));

// Create review (POST)
app.post("/listings/:id/reviews",isLoggedIn, validateReview, wrapAsync(ReviewController.createreview));

// Delete review (DELETE)
app.delete("/listings/:id/reviews/:reviewId",isLoggedIn,isReviewauthor, wrapAsync(ReviewController.deletereview));

// Error handling
app.use((err, req, res, next) => {
  const { statuscode = 500, message = "Something went wrong!" } = err;
  res.status(statuscode).render("listings/error.ejs", { message });
});

//app.get("/", (req, res) => {
  //res.send("Hi from Root");
//});
app.get("/signup",loginController.rendersignupform );

app.post("/signup", wrapAsync(loginController.signupform));
app.get("/login", loginController.renderloginform);
app.post("/login",
  saveRedirectUrl,
  passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),loginController.login);
app.get ("/logout",loginController.logout);
app.get('/search', async (req, res) => {
  const searchQuery = req.query.query; // Get the search query from the form
  if (searchQuery) {
    const listings = await Listing.find({ title: { $regex: searchQuery, $options: 'i' } });
    res.render('search-results', { searchQuery, listings });
  } else {
    res.render('search-results', { searchQuery, listings: [] });
  }
});


 app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
