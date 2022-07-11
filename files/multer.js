const multer = require("multer");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../public_html/", "uploads"),
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

app.get("/", (req, res) => {
  res.json({ status: true });
});

module.exports = { storage: storage };
