const path = require('path');
const fs = require('fs');
const mime = require('mime');
const aws = require('aws-sdk');
const uploadConfig = require('../config/multer');

class S3Storage {
  constructor() {
    this.client = new aws.S3({
      region: 'us-east-2',
    });
  }

  async saveFile(filename) {
    const originalPath = path.resolve(uploadConfig.directory, filename);
    const ContentType = mime.getType(originalPath);

    if (!ContentType) {
      throw new Error('File not found');
    }

    const fileContent = await fs.promises.readFile(originalPath);

    await this.client.putObject({
      Bucket: 'salao-puava-dev',
      Key: filename,
      ACL: 'public-read',
      Body: fileContent,
      ContentType,
    }).promise();

    await fs.promises.unlink(originalPath);
  }

  async deleteFile(filename) {
    await this.client.deleteObject({
      Bucket: 'salao-puava-dev',
      Key: filename,
    }).promise();
  }
}

module.exports = S3Storage;
