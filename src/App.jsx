
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import Workbench from './components/workbench/workbench';
import SQLBuilder from './components/workbench/sql/ui/SQLBuilder';
import CreateSQLTable from './components/workbench/sql/ui/CreateSQLTable';


const App = ()=>{
  return(
  <div>
    <ToastContainer  autoClose={1500} hideProgressBar={false} pauseOnHover={false}/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/email-verify" element={<EmailVerify />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/workbench" element={<Workbench/>} />
      <Route path="/workbench/sqlBuilder" element={<SQLBuilder/>} />
      <Route path="/workbench/sql/CreateSQLTable" element={<CreateSQLTable/>} />
    </Routes>
  </div>

)
}

export default App
