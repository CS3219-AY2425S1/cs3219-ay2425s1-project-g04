import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';
import UserAvatarBox from "./user/userAvatarBox";

function NavigationBar() {
    const navigate = useNavigate();

    // Add log out functionality 
    const handleLogout = () => {
        sessionStorage.removeItem("jwt_token");
        navigate("/login");
    }

    return (
        <Navbar className='bg-light' sticky="top">
            <Container>
                <Navbar.Brand>PeerPrep</Navbar.Brand>
                <UserAvatarBox />
            </Container>
        </Navbar>
    );
}

export default NavigationBar;
