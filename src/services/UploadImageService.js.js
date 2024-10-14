const s3 = require('./aws'); 
const fs = require('fs');

const uploadImage = (filePath, bucketName, key) => {
  const fileContent = fs.readFileSync(filePath); 

  const params = {
    Bucket: bucketName, 
    Key: key, 
    Body: fileContent, 
    ContentType: 'image/png', 
  };

  return s3.upload(params).promise(); 
};

module.exports = uploadImage;
