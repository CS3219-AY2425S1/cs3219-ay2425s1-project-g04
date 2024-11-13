import React from 'react'
import { Editor } from '@monaco-editor/react'
import { Container, Stack, Spinner } from 'react-bootstrap'

const CodeSpace = ({ handleEditorChange, loading, code, language, output, isError }) => {
  return (

<Stack gap={3} className='h-100' style={{ height: '100vh' }}>
    {/* Editor Section (60% of viewport) */}
    <div style={{ borderRadius: '0.5rem', overflow: 'hidden', height: '60vh' }}>
        <Editor
            height="100%"  // Make the editor fill the container
            defaultLanguage="python"
            language={language}
            value={code}
            onChange={handleEditorChange}
            theme="vs-dark"
            options={{
              fontSize: 14  // Set font size here, adjust as needed
          }}
        />
    </div>

    {/* Output Section (40% of viewport) */}
    <Container
        style={{
            height: '30vh', // Occupies 40% of viewport height
            border: '1px solid #ccc',
            borderRadius: '0.5rem',
            padding: '1rem',
            backgroundColor: '#f8f9fa',
        }}
    >
        <p>Output</p>
        {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                <Spinner animation="border" variant="primary" />
                <span className="ms-1">Running...</span>
            </div>
        ) : (
            <div
                style={{
                    height: '90%',
                    overflowY: 'auto',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    border: '1px solid rgba(0, 0, 0, 0.2)',
                    borderRadius: '0.5rem',
                    paddingLeft: '5px',
                    paddingLeft: '10px',
                    fontSize: '16'
                }}
            >
                <p style={{ color: isError ? 'red' : '#212529' }}>{output}</p>
            </div>
        )}
    </Container>
</Stack>
    
    
  )
}

export default CodeSpace