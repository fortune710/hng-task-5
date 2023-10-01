const AWS = require('aws-sdk');

AWS.config.update({ region: "eu-north-1" })

const BUCKET_NAME = "hng-task-5";


const s3 = new AWS.S3({
    accessKeyId: "AKIA2AFNNGD45OZBXCXG",
    secretAccessKey: "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"
})

const uploadFile = (completeFile, keyName) => {
    const url = `https:${BUCKET_NAME}//.s3.eu-north-1.amazonaws.com/${keyName}`

    return new Promise((resolve, reject) => {
        try {
            const base64Data = Buffer.from(JSON.stringify(completeFile))
            const uploadParams = {
                Bucket: BUCKET_NAME,
                Key: keyName,
                Body: base64Data
            };
            
            s3.upload(uploadParams, function (err, data) {
                if (err) {
                    console.log(err, "upload")
                    return reject(err);
                }
                if (data) {
                    return resolve({
                        data,
                        url
                    });
                }
            });
        } catch (err) {
            console.log(err)
            return reject(err);
        }
    })
}
    
module.exports = { uploadFile }