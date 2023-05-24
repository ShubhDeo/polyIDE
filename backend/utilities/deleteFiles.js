const path = require('path');
const fs = require('fs');

const deleteFiles = (fileId, language) => {
    const filePath = path.join(__dirname, '..','codes', `${fileId}.${language}`);
    const inputPath = path.join(__dirname,'..', 'inputs', `${fileId}.txt`);

    if(fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
    if(fs.existsSync(inputPath)) {
        fs.unlinkSync(inputPath);
    }

}

module.exports = deleteFiles;