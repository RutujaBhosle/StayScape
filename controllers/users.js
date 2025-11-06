const User=require("../models/user.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};


module.exports.signup=async(req,res)=>{
    try{ 

    let{username,email,password}=req.body;
    const newUser= new User({email,username});
    const registereduser=await User.register(newUser,password);
    req.login(registereduser,(err)=>{
        if(err){
            return next(err);
        }
        //    console.log(registereduser);
    req.flash("success","welcome to wanderlust");
    res.redirect("/listings");
    });
 
    }catch(err){
        req.flash("error","err.message");
        res.redirect("/signup");
    }
};



module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};




module.exports.login=async (req,res)=>{
    req.flash("success","welcome back to wanderlust!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};




module.exports.logout=(req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out !");
        res.redirect("/listings");
    });
};