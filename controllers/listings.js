const Listing=require("../models/listing.js");



module.exports.index=async(req,res)=>{
    const allListing=await Listing.find({})
    res.render("listings/index.ejs",{allListing});
    };

    module.exports.renderNewForm=(req,res)=>{
        res.render("listings/new.ejs");
    };




module.exports.showListing=async(req,res)=>{
       
    const {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
        path:"author",
        },
    })
    .populate("owner");
        if(!listing){
            req.flash("err","listing you requested for does not exist.!");
            res.redirect("/listings");
        }
        res.render("listings/show",{listing});
        
    };




module.exports.createListing=async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    if(!req.body.listing){
       throw new ExpressError(400,"send valid data for listing");
    }
       
// let {title,description,price,image,country,location}=req.body;
    const newlisting=new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    await newlisting.save();
    req.flash("success","new listing created..")
    res.redirect("/listings");
    };




module.exports.renderEditForm=async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    
        if(!listing){
            req.flash("err","listing you requested for does not exist.!");
            res.redirect("/listings");
        };
        let originalImageUrl=listing.image.url;
        originalImageUrl=originalImageUrl.replace("/upload","upload/w_250");
        res.render("listings/edit.ejs",{listing,originalImageUrl});
    };





module.exports.updateListing=async(req,res)=>{
    let{id}=req.params;    
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
        }
        console.log(req.body);
        req.flash("success","listing updated..")
        res.redirect(`/listings/${id}`);
    };



    
module.exports.deletelisting=async(req,res)=>{
    let{id}=req.params;
    let deletedlisting=await Listing.findByIdAndDelete(id); 
    console.log(deletedlisting);
    req.flash("success","Listing deleted..")
    res.redirect("/listings");   
};