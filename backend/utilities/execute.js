const {exec} = require("child_process");


const execute = (cmd, options={}) => {
    return new Promise((resolve, reject) => {
        exec(cmd,options, (error, stdout, stderr) => {
            error && reject({error, stderr});
            stderr && reject(stderr);
            resolve(stdout);
        })
    })
}

module.exports = execute;