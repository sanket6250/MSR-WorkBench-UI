
import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Workbench from './components/workbench/workbench';
import Home from "./pages/Home";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import SQLBuilder from './components/workbench/sql/ui/SQLBuilder';
import CreateSQLTable from './components/workbench/sql/ui/CreateSQLTable';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './PrivateRoute';
import BGImage from './assets/BGImages/bg5.jpg';
import RouteLoader from "./components/RouteLoader";
import { useContext } from 'react';
import { AppContext } from './context/AppConetxt';
import DocBuilder from './components/workbench/document/DocBuilder';
import BillSplitter from './components/workbench/document/BillSplitter';


const App = ()=>{
  const location = useLocation();

  const { loading } = useContext(AppContext);

  // Routes where footer should be hidden
  const hideFooterRoutes = [
    "/login",
    "/email-verify",
    "/reset-password",
  ];

  const AppLayout = ()=>
  {
    return (  <Routes>
                <Route path="email-verify" element={<EmailVerify />} />
                <Route path="reset-password" element={<ResetPassword />} />
                <Route path="home" element={<Workbench/>} />
                <Route path="home/sqlBuilder" element={<SQLBuilder/>} />
                <Route path="home/sql/CreateSQLTable" element={<CreateSQLTable/>} />
                <Route path="home/doc-extract" element={<DocBuilder/>} />
                <Route path="home/doc-extract/bill-extract" element={<BillSplitter/>} />
            </Routes>  
            );
  }; 

  const shouldShowFooter = !hideFooterRoutes.includes(location.pathname);

  return(
    <>

     {loading && <RouteLoader />}

      <div className="app-layout">
        <ToastContainer  autoClose={1500} hideProgressBar={false} pauseOnHover={false}/>
        <Header/>
        <main className="app-content" style={{ backgroundImage: `url(${BGImage})` }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          
          {/* PROTECTED */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <AppLayout />   {/* contains dashboard, sql builder, etc */}
              </PrivateRoute>
            }
          />

        </Routes>

        </main>
        {shouldShowFooter && <Footer />}
      </div>
    </>
)
}

export default App
