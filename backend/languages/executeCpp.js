const path = require('path');
const execute = require('../utilities/execute');
const deleteFiles = require('../utilities/deleteFiles');


const executeCpp = async (job) => {
    const {fileId} = job;
    const filePath = path.join(__dirname,'..', 'codes', `${fileId}.cpp`);
    const inputPath = path.join(__dirname,'..', 'inputs', `${fileId}.txt`);

    // create a docker container in detach mode, interactive and use bash
    // transfer code file and input file inside container using docker cp
    // run cpp code using docker exec
    // get output and kill container
    // if error, get error and kill container.
    let containerId = ''
    let outputTaken=false;
    execute(`docker run -d -it cpp:v1 /bin/bash`)
        .then(res => {
            containerId = res.substring(0,12);
            console.log('container created.')
            return execute(`docker cp ${filePath} ${containerId}:/usr/src/app/code.cpp && docker cp ${inputPath} ${containerId}:/usr/src/app/input.txt`)
        })
        .then(res => {
            console.log("files transferred.");
            return execute(`docker exec ${containerId} bash -c "g++ code.cpp"`,);
        })
        .then(res => { 
            //For execution time. 
            job["startedAt"]=new Date();
            return execute(`docker exec ${containerId} bash -c "./a.out<input.txt"`, {timeout: 10000, maxBuffer: 50000});
        })
        .then(async (output) => {
            job["completedAt"]=new Date();
            job["status"]="success";
            job["output"]=output;
            await job.save();
            outputTaken=true;

            execute(`docker kill ${containerId} && docker rm ${containerId}`)
                .then(res => {
                    console.log('container removed.')
                }).catch(error => console.log(error))
            
            deleteFiles(fileId, job.language);
            console.log('files deleted')
        })
        .catch(async (error) => {
            console.log(error);

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

module.exports = executeCpp;


