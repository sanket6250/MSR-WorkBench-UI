import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppConetxt";
import { toast } from "react-toastify";
import Header from "../components/Header";


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
                debugger;
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
                 debugger; 
                if(response.status == 200)
                {
                    // Save token manually
                   // console.log(response.data);
                    localStorage.setItem("jwt", response.data.jwtToken);
                    setIsLoggedIn(true);
                    getUserData();
                    navigate("/workbench");
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
            toast.error(error?.response?.data?.message);
        }
        finally{
            setLoading(false);
        }
    }

    return (
        <>
        <div className="auth-bg d-flex justify-content-center align-items-center">
            <div className="auth-overlay" />
            <div className="auth-card">

                <h3 className="text-center fw-bold mb-1">
                {isCreateAccount ? "Create Account" : "Welcome Back"}
                </h3>

                <p className="text-center text-muted mb-4">
                {isCreateAccount
                    ? "Create your MSR Workbench account"
                    : "Login to continue to MSR Workbench"}
                </p>

                <form onSubmit={onSubmit}>
                {isCreateAccount && (
                    <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    </div>
                )}

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                    type="email"
                    className="form-control"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                </div>

                {!isCreateAccount && (
                    <div className="d-flex justify-content-end mb-3">
                    <Link
                        to="/reset-password"
                        className="text-decoration-none fw-semibold text-primary"
                    >
                        Forgot password?
                    </Link>
                    </div>
                )}

                <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-semibold"
                    disabled={loading}
                >
                    {loading
                    ? "Loading..."
                    : isCreateAccount
                    ? "Create Account"
                    : "Login"}
                </button>
                </form>

                <div className="text-center mt-4">
                {isCreateAccount ? (
                    <span className="text-muted">
                    Already have an account?{" "}
                    <span
                        className="fw-semibold text-primary auth-link"
                        onClick={() => setIsCreateAccount(false)}
                    >
                        Login
                    </span>
                    </span>
                ) : (
                    <span className="text-muted">
                    Don’t have an account?{" "}
                    <span
                        className="fw-semibold text-primary auth-link"
                        onClick={() => setIsCreateAccount(true)}
                    >
                        Register
                    </span>
                    </span>
                )}
                </div>
            </div>

            {/* CSS */}
            <style>
                {`
                /* BACKGROUND */
                .auth-bg {
                    position: relative;
                    height: calc(100vh - 88px);
                    background: linear-gradient(
                    135deg,
                    #0f172a,
                    #020617
                    );
                    overflow: hidden;
                }

                 /* TECH GRID PATTERN */
                .auth-bg::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background-image:
                    linear-gradient(
                        rgba(255,255,255,0.05) 1px,
                        transparent 1px
                    ),
                    linear-gradient(
                        90deg,
                        rgba(255,255,255,0.05) 1px,
                        transparent 1px
                    );
                    background-size: 40px 40px;
                    mask-image: radial-gradient(
                    circle at center,
                    black 40%,
                    transparent 70%
                    );
                }


                @keyframes gradientMove {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                /* CARD */
                .auth-card {
                    width: 100%;
                    max-width: 420px;
                    padding: 32px;
                    border-radius: 18px;
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(14px);
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
                    animation: fadeUp 0.6s ease;
                }

                @keyframes fadeUp {
                    from {
                    opacity: 0;
                    transform: translateY(20px);
                    }
                    to {
                    opacity: 1;
                    transform: translateY(0);
                    }
                }

                /* INPUT */
                .form-control {
                    border-radius: 10px;
                    padding: 10px 12px;
                }

                .form-control:focus {
                    border-color: #4f46e5;
                    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.25);
                }

                /* BUTTON */
                .btn-primary {
                    background: linear-gradient(135deg, #4f46e5, #6366f1);
                    border: none;
                    border-radius: 10px;
                    box-shadow: 0 8px 20px rgba(79, 70, 229, 0.4);
                    transition: all 0.2s ease;
                }

                .btn-primary:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 12px 24px rgba(79, 70, 229, 0.5);
                }

                /* LINKS */
                .auth-link {
                    cursor: pointer;
                    text-decoration: underline;
                }
                `}
            </style>
            </div>
        </>
    )
}


export default Login;
