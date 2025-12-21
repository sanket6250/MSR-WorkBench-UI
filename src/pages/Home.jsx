import Header from "../components/Header.jsx";
import Menubar from "../components/Menubar.jsx";


const Home = () =>
{
    return (
        <div className="flext flex-col item-center justify-content-center min-vh-100">
                <Menubar />
                <Header />
        </div>
    )
}


export default Home;