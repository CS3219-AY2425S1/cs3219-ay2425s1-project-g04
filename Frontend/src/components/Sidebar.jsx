import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

function Sidebar() {
    return (
        <Stack gap={3} className='p-3 m-3 justify-content-center align-items-center'>
            <Card>
                <Card.Body>
                    <Card.Title>PeerPrep is...</Card.Title>
                    <Card.Text>
                        A platform for you to practice your technical interview skills with like-minded individuals!
                    </Card.Text>
                </Card.Body>
            </Card>
            <div>
                <Button variant="success">Easy</Button>{' '}
                <Button variant="warning">Medium</Button>{' '}
                <Button variant="danger">Hard</Button>{' '}
            </div>
            <Form.Select aria-label="Default select example">
                <option>Select your language</option>
                <option value="1">Python</option>
                <option value="2">Java</option>
                <option value="3">C++</option>
            </Form.Select>
            <Button variant="primary">Match me!</Button>
        </Stack>
    )
}

export default Sidebar;
