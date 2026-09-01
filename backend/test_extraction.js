require('dotenv').config();
const mongoose = require('mongoose');
const testModel = require('./models/test');
const questionModel = require('./models/question');
const { deleteFile } = require('./services/cloudinary');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => {
    console.log("Connected to DB");
    const questions = await questionModel.find({ bodyImage: { $regex: 'cloudinary' } }).limit(1);
    if (questions.length > 0) {
        console.log("Found image URL:", questions[0].bodyImage);
        
        // try to extract public id the way deleteFile does
        const fileUrl = questions[0].bodyImage;
        const parts = fileUrl.split('/');
        const folderIndex = parts.indexOf('online-exam-portal');
        const fileWithExtension = parts.slice(folderIndex).join('/');
        const lastDot = fileWithExtension.lastIndexOf('.');
        const publicId = lastDot !== -1 ? fileWithExtension.substring(0, lastDot) : fileWithExtension;
        console.log("Extracted public ID:", publicId);
    } else {
        console.log("No questions with cloudinary images found.");
    }
    process.exit(0);
})
.catch(err => {
    console.error(err);
    process.exit(1);
});
