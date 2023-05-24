const express = require('express');
const cors = require('cors');
const {generateFile} = require('./generateFile.js');
const path = require('path');
const dotenv = require('dotenv');
const {connectDB} = require('./utilities/db.js');
const {Job} = require("./models/JobSchema.js");
const {addJobToQueue} = require('./jobQueue.js')
const validateCode = require('./utilities/validateCode.js')

const app = express();

dotenv.config();

//middleware
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());


//connect DB.
connectDB();


app.get('/', (req, res) => {
    return res.json({message: "hello world"});
})

app.get('/status', async (req, res) => {
    try {
        const jobId = req.query.id;
        if(jobId === undefined) {
            return res.status(400).json({success: false, error: "Missing query id."})
        }
        const job = await Job.findById(jobId);
        if(job===undefined) {
            return res.status(404).json({
                success:false, error: "Invalid Job ID."
            })
        }
        return res.status(200).json(job);
    } catch (error) {
        console.log(error);
        return res.status(500).json({succcess:false, error: JSON.stringify(error)});
    }
})

app.post('/run', async (req,res) => {
    const {language="cpp", code, input=""} = req.body;

    if(code === undefined) {
        return res.status(400).json({success: false, message: "Empty code body."})
    }
    if(!validateCode(code, language)) {
        return res.status(400).json({success: false, message: `Invalid use ${language} library`})
    }
    let job;
    try {
        // we need to generate a format file that contains the code.
        const fileLocation = generateFile(language,code, input);
        const fileId = path.basename(fileLocation).split('.')[0];

        job = await new Job({
            language,
            fileId,
        }).save();

        const jobId = job["_id"];

        addJobToQueue(jobId);
        res.status(201).json( {
            success: true,
            jobId
        })
        
        // we sent the job id to the user and then the code will be executed.

        // we need to run the file and send the response back.
    }catch (error) {
        return res.status(500).json({succcess: false, error: JSON.stringify(err)});
    }

})



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
})