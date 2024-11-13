import NavigationBar from './NavigationBar';
import Question from './question/Question';
import Sidebar from './Sidebar';

function Home() {
    return(
        <div>
            <NavigationBar/>
            <div className="row">
                <div className="Navbar col-4">
                    <Sidebar/>
                </div>
                <div className="col-8">
                    <Question/>
                </div>
            </div>
        </div>
    );
}

export default Home;