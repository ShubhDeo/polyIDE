import React from 'react'
import { Form, Row, Col } from 'react-bootstrap'

const Menu = ({
    mode, setMode,
    theme, setTheme,
    fontSize, setFontSize,
    tabSize, setTabSize
}) => {


  return (
    <Row className='mb-5'> 
        <Col xs={12} sm={6} lg={3}>
            <Form.Label>Choose a language</Form.Label>
            <Form.Select
                value={mode}
                onChange={(e) => {
                    setMode(e.target.value);
                }}
            >
            {["c_cpp", "python"].map((lang, index) => (
                    <option key={index} value={lang}>{lang}</option>
            ))}
        </Form.Select>
        </Col>
       <Col xs={12} sm={6} lg={3}>
       <Form.Label>Choose Theme</Form.Label>
        <Form.Select
                value={theme}
                onChange={(e) => {
                    setTheme(e.target.value);
                }}
            >
            {["terminal", "github", "ambiance", "chrome", "chaos", "solarized_dark","monokai","tomorrow_night","twilight"].map((lang, index) => (
                    <option key={index} value={lang}>{lang}</option>
            ))}
        </Form.Select>
       </Col>
       <Col xs={12} sm={6} lg={3}>
       <Form.Label>Font Size</Form.Label>
        <Form.Control
            value={fontSize}
            onChange={(e) => {
                //console.log(e.target.value)
                setFontSize(Number(e.target.value));
            }}
        />
       </Col>
       <Col xs={12} sm={6} lg={3}>
        <Form.Label>Tab Size</Form.Label>
        <Form.Control
            value={tabSize}
            onChange={(e) => {
                //console.log(e.target.value)
                setTabSize(Number(e.target.value));
            }}
        />
       </Col>
    </Row>
  )
}

export default Menu