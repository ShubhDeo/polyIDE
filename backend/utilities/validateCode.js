const validateCode = (code, language) => {
    switch(language) {
        case 'py':
            libs = ["import os", "import subprocess","from os import","from subprocess import"]
            break;
        case 'cpp':
            libs = [ "popen", "fork", "system(", "unistd.h"]
            break;
        default: 
            libs=[];
    }
    
    for(let i=0;i<libs.length;i++) {
        if(code.includes(libs[i])) {
            return false;
        }
    }
    return true;
}

module.exports = validateCode;