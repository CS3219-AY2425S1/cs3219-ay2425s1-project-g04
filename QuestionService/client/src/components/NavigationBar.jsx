import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function NavigationBar() {
    return (
        <Navbar className='bg-light' sticky="top">
            <Container>
                <Navbar.Brand>PeerPrep</Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;
