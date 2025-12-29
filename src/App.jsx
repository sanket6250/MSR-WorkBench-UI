
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

const App = ()=>{
  const location = useLocation();

  // Routes where footer should be hidden
  const hideFooterRoutes = [
    "/login",
    "/email-verify",
    "/reset-password",
  ];

  const shouldShowFooter = !hideFooterRoutes.includes(location.pathname);

  return(
  <div className="app-layout">
    <ToastContainer  autoClose={1500} hideProgressBar={false} pauseOnHover={false}/>
    <Header/>
     <main className="app-content">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/email-verify" element={<EmailVerify />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/workbench" element={<Workbench/>} />
      <Route path="/workbench/sqlBuilder" element={<SQLBuilder/>} />
      <Route path="/workbench/sql/CreateSQLTable" element={<CreateSQLTable/>} />
    </Routes>
    </main>
    {shouldShowFooter && <Footer />}
  </div>

)
}

export default App
