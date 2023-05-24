const Queue = require('bull');
const {Job} = require('./models/JobSchema')
const executeCpp = require('./languages/executeCpp');
const executePy = require('./languages/executePy.js');

const JobQueue = new Queue('job-queue'); //defining queue.

JobQueue.on('failed', (error) => { //for listening to errors.
    console.log(error.failedReason);
})

JobQueue.process(async ({data}) => {
    //'data' is the data that we passed through while adding in queue.
    const {id: jobId} = data;
    const job = await Job.findById(jobId);

    if(job===undefined) {
        throw new Error("Job not found.");
    }   
    
    switch(job.language) {
        case "cpp":
            executeCpp(job);
            break;
        case "py":
            executePy(job);
            break;
        default:
            throw new Error("Invalid Language");
    }
})




const addJobToQueue = async (jobId) => {
    await JobQueue.add({id: jobId});
}

module.exports = {addJobToQueue};