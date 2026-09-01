require('dotenv').config();
const mongoose = require('mongoose');
const testModel = require('./models/test');
const questionModel = require('./models/question');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => {
    console.log("Connected to DB");
    const tests = await testModel.find().sort({_id: -1}).limit(5);
    for (const test of tests) {
        console.log(Test:  ());
        const questions = await questionModel.find({_id: {$in: test.questions}});
        for (const q of questions) {
            console.log(  Question: );
            if (q.bodyImage) console.log(    Body Image: );
            if (q.explanationImage) console.log(    Exp Image: );
            if (q.optionImages && q.optionImages.length) {
                console.log(    Opt Images: );
            }
        }
    }
    process.exit(0);
})
.catch(err => {
    console.error(err);
    process.exit(1);
});
