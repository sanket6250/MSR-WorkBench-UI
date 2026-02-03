import { createContext, useEffect, useState } from "react";
import { APP_CONSTANTS } from "../util/constant";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props)=>
{
    const backendURL = APP_CONSTANTS.BACKEND_URL;
    const [isLoggedIn , setIsLoggedIn] = useState(false);
    const [userData , setUserData] = useState(false);
    const [loading, setLoading] = useState(false);

    const getUserData = async ()=>
    {
        try{
                // If already loaded and not forcing refresh, use cache
                if (userData && !force) return;

                //Profile Details API
                 const response = await axios.get(`${backendURL}/profile` , {  withCredentials: true, validateStatus: () => true ,
                                               headers: localStorage.getItem("jwt") ? {   Authorization: `Bearer ${localStorage.getItem("jwt")}` } : {}});
                 if(response.status == 200)
                {
                    setUserData(response.data);
                    localStorage.setItem("userData", JSON.stringify(response.data)); // cache
                }
                else
                {
                    toast.error((undefined != response?.data?.message) ? response.data.message : "Unable to fetch user details.");
                }
        }
        catch(error)
        {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("jwt");
        const cachedUser = localStorage.getItem("userData");

        if (token) {
            setIsLoggedIn(true);

            if (cachedUser) {
                setUserData(JSON.parse(cachedUser)); // instant load
            } else {
                getUserData(); // first time
            }
        }
    }, []);

    const contextValue = {
        loading , backendURL,
        isLoggedIn , setIsLoggedIn,
        userData , setUserData,
        getUserData,setLoading
    }
    return(
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    )
}
