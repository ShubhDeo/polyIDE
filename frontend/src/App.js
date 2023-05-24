import React from 'react'
import Editor from './Editor'
import {Container} from 'react-bootstrap'

const App = () => {
  return (
   <Container fluid className="px-5 py-3" style={{minHeight: '100vh'}}>
      <h1 className='text-bold'>Poly IDE</h1>
      <h3 className='text-muted'>Code, Compile & Run</h3>
      <p className='mb-5'>Compile & run your code with the polyIDE. Our online compiler supports programming languages like Python and C++ at the moment and provides variouse customized IDE settings.</p>
      <Editor />
   </Container>
  )
}

export default App