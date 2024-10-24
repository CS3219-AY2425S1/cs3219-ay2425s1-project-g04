import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import UserAvatarBox from "./user/userAvatarBox";

function NavigationBar() {

    return (
        <Navbar className='bg-light' sticky="top">
            <Container fluid className="d-flex justify-content-between" style={{ paddingLeft: "32px", paddingRight: "32px" }}>
                <Navbar.Brand
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}  // Scroll to top of home page on click
                style={{ cursor: 'pointer' }}
                >
                    PeerPrep
                </Navbar.Brand>
                <UserAvatarBox/>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;
