const S3 = require('aws-sdk/clients/s3');
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const fs = require('fs');

const { awsRegion, awsAccessKey, awsSecretKey } = require('../Config/app');

console.log(awsRegion, awsAccessKey, awsSecretKey);

const storage = new S3Client({
  region: awsRegion,
  credentials: {
    accessKeyId: awsAccessKey,
    secretAccessKey: awsSecretKey,
  },
});

const uploadToBucket = async (bucketName, file) => {
  //console.log(file);
  const stream = fs.createReadStream(file.path);
  const command = new PutObjectCommand({
    Bucket: 'smoulder-2',
    Key: file.filename,
    Body: stream,
  });

  return storage.send(command);
};

const getObjectUrl = async (filename) => {
  try{
    const command = new GetObjectCommand({
    Bucket: 'smoulder-2',
    Key: filename,
    });
    const url = await getSignedUrl(storage, command);
    return url;
  }
  catch(e){
    console.log(e);
    
  }
};

const deleteObject = async (filename) => {
  const command = new DeleteObjectCommand({
    Bucket: 'smoulder-2',
    Key: filename,
  });
  return storage.send(command);
};

module.exports = { uploadToBucket, getObjectUrl, deleteObject };
