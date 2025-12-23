import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppConetxt";
import { toast } from "react-toastify";


const Login = () =>
{

    const[isCreateAccount , setIsCreateAccount] = useState(false);

    const[name , setName] = useState("");
    const[email , setEmail] = useState("");
    const[password , setPassword] = useState("");
    const[loading , setLoading] = useState(false);

    const {backendURL , setIsLoggedIn , getUserData} = useContext(AppContext);

    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        axios.default.withCredentials = true;
        setLoading(true);
        try{
            if(isCreateAccount)
            {
                //Register User
               const response = await axios.post(`${backendURL}/register` , {name , email , password});
               if(response.status == 200)
               {
                  navigate("/");
                  toast.success("Account created successfully.");
               }
               else
               {
                  toast.error("Account already exists.");
               }
            }
            else
            {
                //Login API
                 const response = await axios.post(`${backendURL}/login` , {email , password} ,{  withCredentials: true, validateStatus: () => true });
                 if(response.status == 200)
                {
                    // Save token manually
                    localStorage.setItem("jwt", res.data.jwtToken);
                    setIsLoggedIn(true);
                    getUserData();
                    navigate("/");
                    toast.success("Logged In successfully.");
                }
                else
                {
                    toast.error("Email / Password incorrect , Please try again.");
                }
            }
        }
        catch(error)
        {
            console.log(error);
            toast.error(error);
        }
        finally{
            setLoading(false);
        }
    }

    return (

        <div className="position-relative min-vh-100 d-flex justify-content-center align-items-center" style={{background:'linear-gradient(90deg , #6a5af9 , #8268f9)' , border:'none'}}>
            <div style={{position:'absolute' ,top:'20px', display:'flex' , alignItems:'center' ,left:'30px'}}>
                <Link to="/" style={{display:"flex" , gap:5,alignItems:'center',fontWeight:'bold',fontSize:'14px',textDecoration:'none'}}>
                    <img src={assets.logo} alt="logo" height={32} width={32}/>
                    <span className="fw-bold fs-4 text-light">MSR Workbench</span>
                </Link>
            </div>

            <div className="card p-4" style={{maxWidth:'400px' , width:'100%'}}>
                
                <h2 className="text-center mb-4">
                    {isCreateAccount ? 'Create Account' : 'Login'}
                </h2>

            <form onSubmit={onSubmit}>

                    {isCreateAccount && (
                         <div className="mb-3">
                            <label htmlFor="fullName" className="form-label">Full Name</label>
                            <input type="text" id="fullName" className="form-control" placeholder="Enter full name" 
                            onChange={(e) => setName(e.target.value)}  value={name}  required/>
                         </div>
                        )
                    }

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email Id</label>
                         <input type="text" id="email" className="form-control" placeholder="Enter an email" 
                         onChange={(e) => setEmail(e.target.value)}  value={email} required/>
                    </div>
                   <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" id="password" className="form-control" placeholder="*************" 
                        onChange={(e) => setPassword(e.target.value)} value={password}  required/>
                    </div>

                    {!isCreateAccount && (
                        <div className="d-flex justify-content-between mb-3">
                         <Link to="/reset-password" className="text-decoration-none" style={{fontWeight:'bold'}}>Forgot Password</Link>
                        </div>
                    )
                    }

                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? "Loading ..." : isCreateAccount ? 'Register' :'Login'}
                    </button>

            </form>

                <div className="text-center mt-3">
                    <p className="mb-0">
                        {isCreateAccount ? (
                        <>
                            Already have an account{" "}
                            <span 
                            onClick={()=> setIsCreateAccount(false)}
                            className="text-decoration-underline" style={{cursor:'pointer'}}>Login here</span>
                        </>) : (
                            <>
                                Don't have an account?{" "}
                                <span 
                                 onClick={()=> setIsCreateAccount(true)}
                                className="text-decoration-underline" style={{cursor:'pointer',gap:5}}>Register</span>
                            </>
                        )}
                    </p>
                </div>

            </div>

        </div>
    )
}


export default Login;