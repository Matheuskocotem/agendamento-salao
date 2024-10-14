const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadToS3 = (fileStream, filePath) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filePath,
    Body: fileStream,
    ContentType: 'image/png', // Você pode ajustar isso conforme o tipo de arquivo
  };

  return s3.upload(params).promise();
};

const deleteFileS3 = (filePath) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filePath,
  };

  return s3.deleteObject(params).promise();
};

module.exports = {
  uploadToS3,
  deleteFileS3,
};
