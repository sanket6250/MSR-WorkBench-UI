import { useContext } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import { AppContext } from '../../context/AppConetxt';
import Header from '../Header';
import Footer from '../Footer';

const Workbench = () =>
{
    const navigate = useNavigate();
    const {userData , isLoggedIn} = useContext(AppContext);

    const startJob = (id)=>
    {
        switch(id)
        {
            case 'SQL':
                navigate("/workbench/sqlBuilder")
            break;
            default:
        }
    }

    return (

    <>
          <Header />

      
          <div className="container d-flex flex-column align-items-center justify-content-center text-center px-3" style={{minHeight: '78vh'}}>
            <img src="/src/assets/logo_home.png" alt="MSR Workbench" width="90" className="mb-3" />

            <h6 className="fw-semibold mb-2">
                Hey {userData ? userData.name : 'User'} <span role="img" aria-label='wave' className="">👋</span>
            </h6>
            <p className="text-muted mb-4" style={{maxWidth: '480px'}}>
                Build, manage, and deploy decentralized organizations faster.
            </p>

            <div className="w-100 d-flex align-items-start gap-3" style={{maxWidth: '720px'}}>
                <div className="d-flex align-items-center gap-3 px-4 py-3 border rounded-3 shadow-sm w-100" style={{minHeight: '120px'}}>
                    <div
                        className="d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{width: '42px',height: '42px',borderRadius: '50%',background: 'rgba(0, 0, 0, 0.06)'}}>
                        <i className="bi bi-diagram-3 fs-5"></i>
                    </div>

                    <div className="text-start">
                        <div className="fw-semibold">SQL Builder</div>
                        <div className="text-muted small">
                           Build SQL in minutes.
                        </div>
                    </div>

                    <button className="btn btn-dark btn-sm rounded-pill ms-auto px-3" onClick={()=>{startJob('SQL')}}>
                        Start
                    </button>
                </div>

                <div className="d-flex align-items-center gap-3 px-4 py-3 border rounded-3 w-100 text-muted" style={{minHeight: '120px'}}>
                    <div
                        className="d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{width: '42px',height: '42px',borderRadius: '50%',background: 'rgba(0, 0, 0, 0.04)'}}>
                        <i className="bi bi-journal-text fs-5"></i>
                    </div>

                    <div className="text-start">
                        <div className="fw-semibold">Text Manager</div>
                        <div className="small">
                            Translate Or Correct Input Text.
                        </div>
                    </div>

                    <span className="ms-auto small fst-italic">Coming soon</span>
                </div>
            </div>
        </div>

        <Footer/>
        
    </>

    )
}

export default Workbench;