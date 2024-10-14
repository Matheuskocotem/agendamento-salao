const S3Storage = require('../utils/S3Storage');

class DeleteImagesService {
  async execute(filename) {
    const s3 = new S3Storage();
    await s3.deleteFile(filename);
  }
}

module.exports = DeleteImagesService;
