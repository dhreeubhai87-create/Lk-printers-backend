const path = require("path");

const uploadArtwork = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No artwork file uploaded"
            });
        }

        const fileUrl =
            `${req.protocol}://${req.get("host")}/uploads/artwork/${req.file.filename}`;

        return res.status(200).json({
            message: "Artwork uploaded successfully",

            response: {
                originalName: req.file.originalname,
                fileName: req.file.filename,
                fileSize: req.file.size,
                mimeType: req.file.mimetype,
                url: fileUrl
            }
        });

    } catch (error) {
        console.error("Artwork upload error:", error);

        return res.status(500).json({
            message: "Artwork upload failed",
            error: error.message
        });
    }
};

module.exports = {
    uploadArtwork
};