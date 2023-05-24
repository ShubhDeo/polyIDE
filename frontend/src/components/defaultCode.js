const defaultCode = (lang) => {
    let cppCode = `#include<iostream>\n`
    cppCode+=`using namespace std;\n\n`
    cppCode+=`int main() {\n`
    cppCode+=`  //enter your code here\n\n`
    cppCode+=`  return 0;\n`
    cppCode+=`}`

    const pyCode = `#enter your code here`

    switch(lang) {
        case 'python':
            return pyCode;
        case 'c_cpp':
            return cppCode;
        default:
            return '';
    }
}

export default defaultCode;