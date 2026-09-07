const express = require("express"); // Import Express

const app = express(); // Create Express application


const packages = require("./data/tour.json"); // Import packages data

// client --> request --> middleware1 --> middleware2 --> middleware3 --> response

// const middleware1 = (req,res,next)=> {
//     console.log("Middleware 1");
//     next();
// }

// const loggger = (req,res,next)=> {
//     console.log(`${req.method} ${req.url}`);
//     next();
// }

// app.use(loggger);

const CheckAge = (req,res,next)=> {
    const age = req.query.age;
    if(age < 18){
        return res.status(403).json("You are not allowed to access this resource");
    }
    next();
}

app.use(CheckAge); // Use CheckAge middleware for all routes
app.get("/",(req,res)=>{
    res.send("Hello World");
});
// const tourRoutes = require("./router/tourRoutes"); // Import tour routes
// app.use("/api/tours", tourRoutes); // Use tour routes for /api/tours endpoint

app.get("/", (req, res) => { // Handle GET request to /
    res.send("Hello World"); // Send response
});

app.get("/packages",(req,res)=>{
    res.json(packages);
});

app.get("/packages/:id",(req,res)=>{
    const packageId = parseInt(req.params.id);
    const selectedPackage = packages.find(item => item.id === packageId);
    res.json(selectedPackage);
});

app.listen(3000, () => { // Start server on port 3000
    console.log("Server is running on port 3000"); // Show confirmation
});