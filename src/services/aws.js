const { S3 } = require('@aws-sdk/client-s3');

const s3 = new S3({
    region: '',//us-east-2
    credentials: {
        accessKeyId: '', //AKIARYEUCHYKO76C36GT IAM_USER_KEY
        secretAccessKey: '', //n6RHhI1ZfTfce8cfFAiX3V229qBIB36jgmiuOdrB IAM_USER_SECRET
    },
});

const BUCKET_NAME = ''; // salao-puava-dev

const uploadToS3 = async (file, path) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: path,
        Body: file.data,
        ContentType: file.mimetype,
        ACL: 'public-read', // ou outra ACL conforme necessário
    };

    try {
        const data = await s3.putObject(params);
        return { error: false, data };
    } catch (err) {
        return { error: true, message: err };
    }
};

const deleteFileS3 = async (filePath) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: filePath,
    };

    try {
        await s3.deleteObject(params);
        return { error: false };
    } catch (err) {
        return { error: true, message: err };
    }
};

module.exports = {
    uploadToS3,
    deleteFileS3,
};
