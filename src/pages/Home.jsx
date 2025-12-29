import Content from "../components/Content.jsx";
import Footer from "../components/Footer.jsx";
import Header from "../components/Header.jsx";

const Home = () =>
{
    return (
        <div className="flext flex-col item-center justify-content-center min-vh-100">
                <Header />
                <Content />
                <Footer/>
        </div>
    )
}


export default Home;