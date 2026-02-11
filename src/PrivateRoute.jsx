import { useContext, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {APP_CONSTANTS} from './util/constant'
import api from "./api";
import { AppContext } from "./context/AppConetxt";

const PrivateRoute = ({ children }) => {
  const [valid, setValid] = useState(null);
  const location = useLocation();
  const backendURL = APP_CONSTANTS.BACKEND_URL;
  const {setLoading} = useContext(AppContext)

  useEffect(() => {
    const validate = async () => {

      //Will not validate form landing page
      if(location.pathname == '/msr-workbench' )
        return children;

      const token = localStorage.getItem("jwt");

      if (!token) {
        setLoading(false);
        setValid(false);
        return;
      }

       setLoading(true);

      try {
        await api.get(`${backendURL}/is-authenticated`); // backend endpoint
        setValid(true);
      } catch {
        localStorage.removeItem("jwt");
        setValid(false);
      } 
      finally
      {
        setLoading(false);
      }
    };

    validate();
  }, []);

  if (valid == false) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
