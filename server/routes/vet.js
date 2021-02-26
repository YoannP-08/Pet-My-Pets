const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const fetch = require("node-fetch");
/**
 * GET vet location
 * @route GET localhost:4000/api/comment
 * @description get all the comment
 * @access Private
 * @return array
 */
router.post("/", async (req, res) => {
    let { lat, long } = req.body;
    fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=1500&type=veterinary_care&key=${process.env.GOOGLE_API_KEY}`)
        .then(res => res.json())
        .then(googleResponse => {
            return res.status(201).json(googleResponse.results) })
});
module.exports = router;
