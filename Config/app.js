require('dotenv').config()

module.exports = {
    appPort: process.env.APP_PORT,
    appUrl: process.env.APP_URL,
    appKey: process.env.APP_KEY,
    frontendUrl: process.env.FRONTEND_URL,
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    awsRegion: process.env.AWS_REGION,
    awsAccessKey: process.env.AWS_ACCESS_KEY,
    awsSecretKey: process.env.AWS_SECRET_KEY,
}
