import React, {useEffect, useState} from 'react'
import { InputGroup, Form, Button,Spinner } from 'react-bootstrap'
import moment from 'moment'

const InputOutputContainer = ({
    input,
    setInput,
    output,
    executeCode,
    disableButton,
}) => {

    const [outputMessage, setOutputMessage] = useState("");

    useEffect(() => {
        let {status, output: codeOutput,submittedAt, startedAt, completedAt, _id: jobId} = output;
        
        if(status!==undefined) {
            submittedAt = moment(submittedAt).toString();
            let message=``;
            message += `Job ID : ${jobId}\n`
            message += `Submitted At: ${submittedAt}\n`
            if(status==='success') {
                let s = moment(startedAt);
                let e = moment(completedAt);
                let execTime = e.diff(s, 'seconds', true);
                message+= `Status: Success\n`
                message += `Execution time: ${execTime}s\n`
                message += `Output: ${codeOutput}\n`
            }else if(status==='error') {
                const errorMessage = JSON.parse(codeOutput);
                message+=`Status: Error\n`
                message+= `Error: ${errorMessage["stderr"]!=='' ? errorMessage["stderr"]:'Timeout error'}\n`
            }
            setOutputMessage(message);
        }else {
            setOutputMessage("");
        }
    }, [output]);

  return (
    <>
        <InputGroup>
                    <InputGroup.Text>Input Area</InputGroup.Text>
                    <Form.Control 
                        as="textarea" 
                        aria-label="input area" 
                        rows="7"
                        value={input}
                        onChange={(e) => {setInput(e.target.value)}}
                    />
                </InputGroup>
                <div className='d-flex justify-content-end my-5'>
                    {disableButton && (<Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>)}
                    <Button disabled={disableButton} variant="primary" onClick={executeCode}>Run</Button>
                </div>
                <InputGroup>
                    <InputGroup.Text>Output Area</InputGroup.Text>
                    <Form.Control 
                        as="textarea" 
                        aria-label="output area" 
                        rows="14"
                        value={outputMessage}
                        readOnly
                    />
        </InputGroup>
    </>
  )
}

export default InputOutputContainer