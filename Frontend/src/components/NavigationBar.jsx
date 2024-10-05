import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router-dom';

function NavigationBar() {
    const navigate = useNavigate();

    // Add log out functionality 
    const handleLogout = () => {
        navigate("/login");
    }

    return (
        <Navbar className='bg-light' sticky="top">
            <Container>
                <Navbar.Brand>PeerPrep</Navbar.Brand>
                <Button className="ms-auto" variant="danger" onClick={handleLogout}>
                    Logout
                </Button>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;
