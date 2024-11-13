import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useLocation, useNavigate } from 'react-router-dom'; // Import hooks
import UserAvatarBox from "./user/userAvatarBox";

function NavigationBar() {
    const location = useLocation(); // Get the current location
    const navigate = useNavigate(); // Function to navigate programmatically

    const handleBrandClick = () => {
        if (location.pathname === '/home') {
            // Scroll to top if on the home page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (location.pathname !== '/home') {
            // Navigate to /home if not on the home page
            navigate('/home');
        }
        // Do nothing if already on /home
    };

    return (
        <Navbar className='bg-light' sticky="top">
            <Container fluid className="d-flex justify-content-between" style={{ paddingLeft: "32px", paddingRight: "32px" }}>
                <Navbar.Brand
                    onClick={handleBrandClick} // Handle the click event
                    style={{ cursor: 'pointer' }}
                >
                    PeerPrep
                </Navbar.Brand>
                <UserAvatarBox />
            </Container>
        </Navbar>
    );
}

export default NavigationBar;
