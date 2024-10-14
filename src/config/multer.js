const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

const storage = multer.diskStorage({
  destination: tmpFolder,
  filename: (req, file, callback) => {
    const fileHash = crypto.randomBytes(10).toString('hex');
    const filename = `${fileHash}-${file.originalname}`;
    callback(null, filename);
  },
});

const upload = multer({ storage });

module.exports = upload;
