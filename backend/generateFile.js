const path = require('path');
const {v4: uuid} = require("uuid");
const fs = require("fs");

const codesFolder = path.join(__dirname, 'codes');
const inputFolder = path.join(__dirname, 'inputs');
if(!fs.existsSync(codesFolder)) {
    //create folder.
    fs.mkdirSync(codesFolder, {recursive: true});
}
if(!fs.existsSync(inputFolder)) {
    //creates input file
    fs.mkdirSync(inputFolder, {recursive: true});
}

const generateFile = (format, code,input) => {
    //created codes folder.
    try {
        const codeId = uuid();
        const fileLocation = path.join(codesFolder, `${codeId}.${format}`);
        const inputFilePath = path.join(inputFolder, `${codeId}.txt`)
        fs.writeFileSync(inputFilePath, input);
        fs.writeFileSync(fileLocation, code);
        return fileLocation;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

module.exports = {generateFile};





