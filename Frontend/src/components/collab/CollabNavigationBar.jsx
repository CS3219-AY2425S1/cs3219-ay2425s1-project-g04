import React from 'react';
import { Button, Container, Navbar, Nav, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'react-bootstrap';

const CollabNavigationBar = ({ handleExit, users, handleCodeRun, setLanguage, language }) => {

  return (
     <Navbar className='bg-light' sticky='top'>
        <Container className='d-flex justify-content-between'>
          
          {/* Language Dropdown on left */}
          <Nav className='me-auto'>
            <Dropdown onSelect={(eventKey) => setLanguage(eventKey)}>
              <DropdownToggle style={{ backgroundColor: 'transparent', border: '1px solid #ccc', borderRadius: '0', color: '#000', padding: '8px 16px'}}>
                {language}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem eventKey="python">Python</DropdownItem>
                <DropdownItem eventKey="c++">C++</DropdownItem>
                <DropdownItem eventKey="java">Java</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Nav>
          
          {/* Run Code and Exit Buttons in Center */}
          <Nav className='mx-auto'>
            <Button onClick={handleCodeRun}>Run Code</Button>
            <Button variant="danger" className="ms-2" onClick={handleExit}>Exit</Button>
          </Nav>
          
          {/* Users at the right */}
          <Nav className='d-flex align-items-center'>
            <p className='mb-0 me-2'>Online:</p>
            {users.map(user => {
                return <div
                className='border rounded p-2 bg-secondary text-center mx-2'
                style={{ minWidth: '100px'}}>
                  {user}
                </div>
            })}
          </Nav>
        </Container>
     </Navbar>
  )
}

export default CollabNavigationBar