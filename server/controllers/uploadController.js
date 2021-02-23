const aws = require('aws-sdk');
const { M_S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

module.exports = {
    upload: (req, res) => {
        aws.config = {
            region: 'us-west-1',
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
          };
        
          const s3 = new aws.S3();
          const fileName = req.query['file-name'];
          const fileType = req.query['file-type'];
          const s3Params = {
            Bucket: M_S3_BUCKET,
            Key: fileName,
            Expires: 60,
            ContentType: fileType,
            ACL: 'public-read',
          };
        
          s3.getSignedUrl('putObject', s3Params, (err, data) => {
            if (err) {
              console.log(err);
              return res.end();
            }
            const returnData = {
              signedRequest: data,
              url: `https://${M_S3_BUCKET}.s3.amazonaws.com/${fileName}`,
            };
        
            return res.send(returnData);
          });
    }
}