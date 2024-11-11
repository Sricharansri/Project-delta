const User=require("../models/user.js");
module.exports.rendersignupform=(req, res) => {
    res.render("users/signup.ejs");
  };
module.exports.signupform=async (req, res) => {
    const { username, email, password } = req.body;
  
    // Create a new User with the email as username
    const newUser = new User({ email, username });
  
    try {
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser,(err)=>{
        if(err)
        {
          return next(err);
        }
        req.flash("success", "User was registered!");
        res.redirect("/listings");
  
      });
     
    } catch (error) {
      req.flash("error", "Error registering user: " + error.message);
      res.redirect("/signup");
    }
  };
  module.exports.renderloginform=(req, res) => {
    res.render("users/login.ejs");
  };
  module.exports.login=async(req,res)=>{
    req.flash("success","welcome to wanderlust you are logged in!");
    let redirecturl=res.locals.redirectUrl||"/listings";
    res.redirect(redirecturl);
   
  
  
  };
  module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
     if(err)
     {
      return next(err);
     }
     req.flash("success","you are logged out now");
     res.redirect("/listings");
    });
  };