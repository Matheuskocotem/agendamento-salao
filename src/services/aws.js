const { S3 } = require('@aws-sdk/client-s3');

const s3 = new S3({
    region: '',  // us-east-2
    credentials: {
        accessKeyId: '', // AKIARYEUCHYKO76C36GT
        secretAccessKey: '', // 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
    },
});

module.exports = {
    BUCKET_NAME: '', // salao-puava-dev

    uploadToS3: async function (file, filename, acl = 'public-read') {
        try {
            const params = {
                Bucket: this.BUCKET_NAME,
                Key: filename,
                Body: file.data,
                ACL: acl,
            };

            const data = await s3.putObject(params);
            return { error: false, message: data };
        } catch (err) {
            console.error('Erro ao fazer upload para o S3:', err);
            return { error: true, message: err };
        }
    },

    deleteFileS3: async function (key) {
        try {
            const params = {
                Bucket: this.BUCKET_NAME,
                Key: key,
            };

            const data = await s3.deleteObject(params);
            return { error: false, message: data };
        } catch (err) {
            console.error('Erro ao excluir o arquivo do S3:', err);
            return { error: true, message: err };
        }
    },
};