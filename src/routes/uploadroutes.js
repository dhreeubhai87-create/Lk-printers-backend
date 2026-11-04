const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadmiddleware");
const auth = require("../middleware/authmiddleware");

const {
    uploadArtwork
} = require("../controllers/uploadcontroller");

router.post(
    "/artwork",
    auth,
    upload.single("file"),
    uploadArtwork
);

module.exports = router;