const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Create the images directory if it doesn't exist
const imagesPath = path.join(__dirname, "../images");

if (!fs.existsSync(imagesPath)) {
  fs.mkdirSync(imagesPath, { recursive: true });
}

// Photo Storage
const photoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesPath);
  },

  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname,
    );
  },
});

// Photo Upload Middleware
const photoUpload = multer({
  storage: photoStorage,

  fileFilter: function (req, file, cb) {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

    const fileExtension = path.extname(file.originalname).toLowerCase();

    const isImage =
      file.mimetype.startsWith("image") ||
      (file.mimetype === "application/octet-stream" &&
        imageExtensions.includes(fileExtension));

    if (isImage) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file format"), false);
    }
  },

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = photoUpload;
