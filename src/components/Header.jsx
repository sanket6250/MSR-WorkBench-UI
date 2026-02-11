import { useContext, useEffect, useRef, useState } from 'react';
import {assets} from '../assets/assets'
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from '../context/AppConetxt';
import axios from 'axios';
import { toast } from 'react-toastify';


const Header = ()=>
{
    const navigate = useNavigate();
    const {userData , backendURL , setUserData , setIsLoggedIn} = useContext(AppContext);
    const[dropdownOpen , setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const location = useLocation();
    const isLoginPage = location.pathname.includes('/login');

    useEffect( ()=>
    {
        const handleClickOutSide = (event) =>
        {
            if(dropdownRef.current && !dropdownRef.current.contains(event.target))
            {
                setDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown" , handleClickOutSide);
        return ()=> document.removeEventListener("mousedown" , handleClickOutSide);
    } , []);

    const handeLogOut = async () =>
    {
        try{
            axios.defaults.withCredentials = true;
            const response =  await axios.post(backendURL + '/logout');
            if(response.status == 200)
            {
                setUserData(false);
                setIsLoggedIn(false);
                localStorage.removeItem("jwt"); // clear invalid token
                navigate("/");
                toast.error("Logged out successfully!");
            }
            else
            {
                 toast.error("Error occcured while logging out.");
            }
        }
        catch(error)
        {
            toast.error(error);
        }
    }

    return (

        <nav className="navbar px-5 d-flex justify-content-between align-items-center" style={{minHeight: '30px',maxHeight: '72px', backgroundColor:'rgb(8 16 41)'}} >
            <div className="d-flex align-items-center gap-2 ">
                <a href='/MSR-WorkBench-UI/' style={{display: 'flex' , gap: '5px' , textDecoration: 'none'}}>
                    <img src={assets.logo} alt="logo" width={32} height={32}/>
                    <span className="fw-bold fs-4 text-white">MSR Workbench</span>
                </a>
            </div>

            {userData ? (
                    <div className="position-relative" ref={dropdownRef}>
                        <div className='bg-dark text-white rounded-circle d-flex justify-content-center align-items-center' 
                                style={{width:'40px' , height:'40px',cursor:'pointer',userSelect:'none'}} onClick={() => setDropdownOpen((prev) => !prev)}>
                            {userData.name[0].toUpperCase()}
                        </div>

                    {dropdownOpen &&(
                        <div className="position-absolute shadow bg-white p-2" style={{top:'50px' , right:'25px',zIndex:100}}>
                            {!userData.isAccountVerified && (
                                <div className="dropdown-item py-1 px-2" style={{cursor:'pointer'}}>
                                    Verify Email
                                </div>
                            )}   

                            <div className="drpdown-item py-1 px-2 text-danger" style={{cursor:'pointer'}} onClick={()=>handeLogOut()} >
                                Logout <i className='bi bi-arrow-right ms-2'></i>
                            </div>
                        </div>
                    )}
                    </div>
            ) : (

                isLoginPage ? '' :

                <div className="btn btn-outline-dark rounded-pill px-3" onClick={()=>navigate('/login')} style={{backgroundColor: 'white'}}
                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4abbb6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                Login <i className="bi bi-arrow-right ms-2"></i>
                </div>
            )}
        </nav>
    )
}

export default Header;