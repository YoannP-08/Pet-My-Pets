const express = require("express");
const { findById } = require("../models/KeeperAd");
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const auth = require("../middleware/auth");

//Import Keeper Schema//
const KeeperAd = require("../models/KeeperAd");

// Initialise the storage for the pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

const upload = multer({ storage: storage });

// GET all keeperAd//
// @route GET localhost:4000/api/keeperads
// @description: get all the keeperAd
// @access Public
// @return array //

router.get("/", async (req, res) => {
  try {
    const keeper = await KeeperAd.find().populate("user_id", ["firstname", "lastname", "username", "email", "isAdmin"])

    if (!keeper) throw Error("No keeper ad found");

    res.status(200).json({ message: "Success", data: keeper });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

// GET one keeperAd //
// @route GET localhost:4000/api/keeperads/:id
// @description: get one keeperAd
// @params: user id //
// @access Public
// @return object //

router.get("/:id", async (req, res) => {
  try {
    const keeper = await KeeperAd.findById(req.params.id).populate("user_id", ["firstname", "lastname", "username", "email", "isAdmin"]);

    if (!keeper) throw Error("No keeper ad found");

    res.status(200).json({ message: "Success", data: keeper });
  } catch (err) {
    res.status(400).json({ messsage: err });
  }
});

// DELETE one keeper //
// @route DELETE localhost:4000/api/keeper/delete/:id //
// @description : delete one keeperAd //
// @params: user id //
// @access Private //
// @return object //

router.delete("/:id", auth, async (req, res) => {
  const keeperAd = await KeeperAd.findById(req.params.id);

  if (req.user.id == keeperAd.user_id || req.user.isAdmin) {
    try {
      const keeper = await KeeperAd.findByIdAndDelete(req.params.id);

      if (!keeper) throw Error("No Keeper ad found");

      res.status(200).json({ message: "The ad was deleted successfully" });
    } catch (err) {
      res.status(400).json({ message: err });
    }
  } else {
    return res.status(403).json({ message: "Unauthorized" });
  }
});

// POST one keeper //
// @route POST localhost:4000/api/keeper/posts //
// @description : create a new keeperAd //
// @access Private //
// @return object //

router.post("/", upload.single('photo'), auth, async (req, res) => {
  if (req.user) {
    try {
      const newKeeperAd = new KeeperAd({
        title: req.body.title,
        description: req.body.description,
        zipCode: req.body.zipCode,
        user_id: req.body.user_id,
        photo: {
          data: fs.readFileSync(path.resolve(__dirname, '../uploads/', req.file.filename)),
          contentType: 'image/png'
        },
        animalType: req.body.animalType,
        start: req.body.start,
        end: req.body.end
      });
      const keeperAd = await newKeeperAd.save();

      if (!keeperAd) {
        res
          .status(400)
          .json({ message: "Something went wrong while saving in database" });
      }
      res.status(201).json({ message: "New Keeper Ad created", data: keeperAd });

    } catch (err) {
      res.status(400).json({ message: err });
    }
  } else {
    return res.status(403).json("Unauthorized");
  }
});

// PUT one keeper //
// @route PUT localhost:4000/api/keeper/update/:id //
// @description : update keeperAd //
// @params: user id //
// @access Private //
// @return object //

router.put("/:id", upload.single('photo'), auth, async (req, res) => {
  const checkKeeperAdId = await KeeperAd.findById(req.params.id);
  let keeperAd = '';
  if (req.user.id == checkKeeperAdId.user_id || req.user.isAdmin) {
    try {
      if (req.file) {
        const newKeeperAd = {
          title: req.body.title,
          description: req.body.description,
          zipCode: req.body.zipCode,
          user_id: req.body.user_id,
          start: req.body.start,
          end: req.body.end,
          photo: {
            data: fs.readFileSync(path.resolve(__dirname, '../uploads/', req.file.filename)),
            contentType: 'image/png'
          },
          animalType: req.body.animalType
        };
        keeperAd = await KeeperAd.findByIdAndUpdate({ _id: req.params.id }, newKeeperAd)
      }
      else {
        keeperAd = await KeeperAd.findByIdAndUpdate({ _id: req.params.id }, req.body)
      }
      const newUpdate = await KeeperAd.findById(keeperAd._id);
      if (!keeperAd) {
        res
          .status(400)
          .json({ message: "Something went wrong while updating in database" });
      }
      res
        .status(200)
        .json({ message: "Ad successfully updated", data: newUpdate });
    } catch (e) {
      res.status(400).json({ Error: e })
    }
  } else {
    return res.status(403).json({ message: "This request is unauthorized" });
  }
});

module.exports = router;

