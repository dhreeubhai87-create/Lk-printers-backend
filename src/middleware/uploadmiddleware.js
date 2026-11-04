const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = path.join(
    __dirname,
    "../../uploads/artwork"
);

// Create folder automatically
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, {
        recursive: true
    });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);

        const baseName = path
            .basename(file.originalname, extension)
            .replace(/[^a-zA-Z0-9-_]/g, "_");

        const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1E9)}-${baseName}${extension}`;

        cb(null, uniqueName);
    }
});

const allowedExtensions = [
    ".pdf",
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".ai",
    ".cdr"
];

const fileFilter = (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(extension)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Invalid file type. Allowed: PDF, JPG, JPEG, PNG, WEBP, AI, CDR"
            ),
            false
        );
    }
};

const upload = multer({
    storage,
    fileFilter,

    limits: {
        fileSize: 25 * 1024 * 1024 // 25 MB
    }
});

module.exports = upload;