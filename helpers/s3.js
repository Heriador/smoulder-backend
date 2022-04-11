const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');

const { awsRegion, awsAccessKey, awsSecretKey } = require('../Config/app')



const storage = new S3({
     accessKeyId: awsAccessKey,
     secretAccessKey: awsSecretKey,
     region: awsRegion
})

const uploadToBucket = (bucketName, file) => {

     const stream = fs.createReadStream(file.path)
     const params = {
          Bucket: bucketName,
          Key: file.filename,
          Body: stream,
     }

     return storage.upload(params).promise()
}




module.exports = uploadToBucket
