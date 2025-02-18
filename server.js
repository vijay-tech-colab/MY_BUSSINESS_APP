const app = require('./app.js');
const cloudinary = require('cloudinary');
const { dbConnection } = require('./Database/dbConnection.js');
const PORT = process.env.PORT || 3000;

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.listen(PORT, async () => {  
    await dbConnection();  
    console.log(`Server is running on http://localhost:${PORT}`);
});
