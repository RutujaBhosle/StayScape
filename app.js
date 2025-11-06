if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}
console.log(process.env.SECRET);




const express=require("express");
const app= express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride= require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const session=require("express-session");
const MongoStore = require('connect-mongo');

const flash=require("connect-flash");


const listingsrouter=require("./routes/listing.js");
const reviewsrouter=require("./routes/review.js");
const userrouter=require("./routes/user.js");
const { date } = require("joi");
const { listingSchema } = require('./schema.js');



const dbUrl=process.env.ATLASDB_URL;


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate) 
app.use(express.static(path.join(__dirname,"/public")));


const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionoptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() * 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }
};


// app.get("/",(req,res)=>{
//     res.send("hii,i am root..")
// })



app.use(session(sessionoptions));
app.use(flash());



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeuser=new User({
//         email:"student@gmail.com",
//         username:"delta-student",

//     });
//     let registereduser=await User.register(fakeuser,"helloworld");
//     res.send(registereduser);
// })


main ()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(dbUrl);
    
}



app.use("/listings",listingsrouter);
app.use("/listings/:id/reviews",reviewsrouter);
app.use("/",userrouter);




// app.get("/testlisting",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"my new villa",
//         description:"by the beach",
//         price:1200,
//         location:"lonavla",
//         contry:"india"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// })

// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"page not found!"));
// });

app.use((err,req,res,next)=>{ 
    let{statuscode=500,message="page not found"}=err;
    // res.status(statuscode).render("error.ejs",{message});
    console.error(err.stack);
     res.status(statuscode).send(message);
})


app.listen(8080,()=>{
    console.log("server is listening on port 8080..")
})