if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

module.exports = {
  appPort: process.env.PORT,
  appUrl: process.env.APP_URL,
  frontendUrl: process.env.FRONTEND_URL,
  appKey: process.env.APP_KEY,
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  awsRegion: process.env.APP_AWS_REGION,
  awsAccessKey: process.env.APP_AWS_ACCESS_KEY,
  awsSecretKey: process.env.APP_AWS_SECRET_KEY,
};
