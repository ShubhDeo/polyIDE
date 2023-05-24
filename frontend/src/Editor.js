import React, {useState, useEffect} from 'react'
import AceEditor from 'react-ace'
import { Row, Col } from 'react-bootstrap'
import Menu from './components/Menu'
import defaultCode from './components/defaultCode'
import 'brace/theme/terminal'
import 'brace/theme/github'
import 'brace/theme/monokai'
import 'brace/theme/ambiance'
import 'brace/theme/chrome'
import 'brace/theme/chaos'
import 'brace/theme/solarized_dark'
import 'brace/theme/tomorrow_night'
import 'brace/theme/twilight'
import 'brace/mode/c_cpp'
import 'brace/mode/python'
import InputOutputContainer from './components/InputOutputContainer'
import axios from 'axios';

const Editor = () => {
    const [code, setCode] = useState("");
    const [input, setInput] = useState(``);
    const [fontSize, setFontSize] = useState(12);
    const [theme, setTheme] = useState('terminal');
    const [mode, setMode] = useState('c_cpp');
    const [tabSize, setTabSize] = useState(4);
    const [output, setOutput] = useState("");
    const [extension, setExtension] = useState("cpp");
    const [disableButton, setDisableButton] = useState(false);


    useEffect(() => {
        setCode(defaultCode(mode));
        if(mode==='c_cpp') {
            setExtension("cpp");
        }else if(mode==='python') {
            setExtension("py");
        }
    }, [mode])


    const executeCode = async () => {
        //console.log('exec code...');
        setOutput('');
        setDisableButton(true);
        const baseUrl = process.env.REACT_APP_BACKEND_SERVER;
        //console.log(baseUrl);
        try {
            const {data} = await axios.post(`${baseUrl}/run`, 
            {
                code,
                language: extension,
                input
            });
            const {success, jobId} = data;
            //console.log(data);
            if(success) {
                //console.log('success');
                const requestInterval = setInterval(async () => {
                    try {
                        const {data: resData} = await axios.get(`${baseUrl}/status?id=${jobId}`);
                        const {status} = resData;
                        if(status===undefined) {
                            setDisableButton(false);
                            clearInterval(requestInterval);
                        }
                        else if(status==="success" || status==="error") {
                            setDisableButton(false);
                            setOutput(resData);
                            console.log(resData);
                            clearInterval(requestInterval);
                        }else {
                            console.log('polling at the server...');
                        }
                    } catch (error) {
                        setDisableButton(false);
                        console.log(error);
                        setOutput(error);
                        clearInterval(requestInterval);
                    }
                }, 1000);
            }else {
                setDisableButton(false);
                console.log(data);
            }
        } catch ({response}) {
            setDisableButton(false);
            alert(response.data.message);
            console.log(response);
        }
    }

  return (
        <Row>
            <Menu 
                    fontSize={fontSize}
                    setFontSize={setFontSize}
                    theme={theme}
                    setTheme={setTheme}
                    mode={mode}
                    setMode={setMode}
                    tabSize={tabSize}
                    setTabSize={setTabSize}
            />
            <Col xs={12} lg={7} className='mb-5'>
                <AceEditor 
                    mode={mode}
                    theme={theme}
                    onChange={(codeValue) => {setCode(codeValue)}}
                    value={code}
                    editorProps={{ $blockScrolling: true }}
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: true
                    }}
                    fontSize={fontSize}
                    tabSize={tabSize}
                    height= '80vh'
                    width= '100%'
                />
            </Col>
            <Col xs={12} lg={5}>
                <InputOutputContainer 
                    input={input}
                    setInput={setInput}
                    output={output}
                    executeCode={executeCode}
                    disableButton={disableButton}
                />
            </Col>
        </Row>
  )
}

export default Editor