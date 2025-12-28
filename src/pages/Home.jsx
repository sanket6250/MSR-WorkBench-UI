import Content from "../components/content.jsx";
import Header from "../components/Header.jsx";

const Home = () =>
{
    return (
        <div className="flext flex-col item-center justify-content-center min-vh-100">
                <Header />
                <Content />
        </div>
    )
}


export default Home;