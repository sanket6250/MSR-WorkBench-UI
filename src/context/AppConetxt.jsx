import { createContext, use, useState } from "react";
import { APP_CONSTANTS } from "../util/constant";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props)=>
{
    const backendURL = APP_CONSTANTS.BACKEND_URL;
    const [isLoggedIn , setIsLoggedIn] = useState(false);
    const [userData , setUserData] = useState(false);

    const getUserData = async ()=>
    {
        try{
                //Profile Details API
                 const response = await axios.get(`${backendURL}/profile` , {  withCredentials: true, validateStatus: () => true ,
                                               headers: localStorage.getItem("jwt") ? {   Authorization: `Bearer ${localStorage.getItem("jwt")}` } : {}});
                 if(response.status == 200)
                {
                    setUserData(response.data);
                }
                else
                {
                    toast.error("Unable to fetch user details.");
                }
        }
        catch(error)
        {
            toast.error(error.message);
        }
    }

    const contextValue = {
        backendURL,
        isLoggedIn , setIsLoggedIn,
        userData , setUserData,
        getUserData,
    }
    return(
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    )
}
