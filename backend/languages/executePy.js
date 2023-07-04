const path = require('path');
const execute = require('../utilities/execute');
const deleteFiles = require('../utilities/deleteFiles')
const redisClient = require('../utilities/redisDb.js');


const executePy = (job) => {
    const {fileId} = job;
    const filePath = path.join(__dirname,'..', 'codes', `${fileId}.py`);
    const inputPath = path.join(__dirname,'..', 'inputs', `${fileId}.txt`);

    let containerId = ''
    let outputTaken=false;
    execute(`docker run -d -it python:v1 /bin/bash`)
        .then(res => {
            containerId = res.substring(0,12);
            console.log('container created.')
            return execute(`docker cp ${filePath} ${containerId}:/usr/src/app/code.py && docker cp ${inputPath} ${containerId}:/usr/src/app/input.txt`)
        })
        .then(res => {
            console.log("files transferred.");
            job["startedAt"]=new Date();
            return execute(`docker exec ${containerId} bash -c "python3 code.py<input.txt"`, {timeout: 10000, maxBuffer: 5000000});
        })
        .then(async (output) => {
            job["completedAt"]=new Date();
            job["status"]="success";
            job["output"]=output;
            await job.save();
            outputTaken=true;
            await redisClient.del(`${job._id}`);

            execute(`docker kill ${containerId} && docker rm ${containerId}`)
                .then(res => {
                    console.log('container removed.')
                }).catch(error => console.log(error))
            
            deleteFiles(fileId, job.language);
            console.log('files deleted')
        })
        .catch(async (error) => {
            console.log(error);
            await redisClient.del(`${job._id}`);
            if(!outputTaken) {
                job["status"]="error";
                job["output"]=JSON.stringify(error);
                await job.save();
            }

            if(containerId!=='') {
                execute(`docker kill ${containerId} && docker rm ${containerId}`)
                .then(res => {
                    console.log('container removed.')
                }).catch(error => console.log(error))
            }
            
            deleteFiles(fileId, job.language);
            console.log('files deleted')
        })
   }


module.exports = executePy;


