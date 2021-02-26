const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
require('dotenv/config');

// Assign environment variables

const port = process.env.PORT || 4000;

// Initialise an express server
const app = express();
if (!module.parent) {
    app.use(cors({
        credentials: true
    }))

    app.use(express.json());

    //Connect DB//
    mongoose.connect(process.env.MONGO_URI,
        { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
        .then(() => { console.log("connected DB") })
        .catch(err => console.log(err))

    // Import Routes//
    const userRoutes = require("../routes/user");
    const donationAdRoutes = require("../routes/donationAd");
    const keeperAddRoutes = require("../routes/keeperAd");
    const postRoutes = require("../routes/post");
    const commentRoutes = require("../routes/comment");
    const reportRoutes = require("../routes/report");
    const vetRoutes = require("../routes/vet");


    //Use Routes//
    app.use("/api/users", userRoutes);
    app.use("/api/keeperads", keeperAddRoutes)
    app.use("/api/posts", postRoutes);
    app.use("/api/donationads", donationAdRoutes)
    app.use("/api/comments", commentRoutes);
    app.use("/api/reports", reportRoutes);
    app.use("/api/vet", vetRoutes);


    app.listen(port, () => console.log(`Listening on port ${port}`));
}
module.exports = app;


