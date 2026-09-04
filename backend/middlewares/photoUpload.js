const path = require("path");
const multer = require("multer");

// Photo Storage
const photoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: function (req, file, cb) {
    if (file) {
      cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
    } else {
      cb(null, false);
    }
  },
});

// Photo upoad MiddleWare
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
  limits: { fileSize: 1024 * 1024 * 10 }, // 10 MB
});

module.exports = photoUpload;
