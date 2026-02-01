import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {APP_CONSTANTS} from './util/constant'
import api from "./api";

const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const location = useLocation();
  const backendURL = APP_CONSTANTS.BACKEND_URL;

  useEffect(() => {
    const validate = async () => {
      const token = localStorage.getItem("jwt");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await api.get(`${backendURL}/is-authenticated`); // backend endpoint
        setValid(true);
      } catch {
        localStorage.removeItem("jwt");
        setValid(false);
      } finally {
        setLoading(false);
      }
    };

    validate();
  }, []);

  if (loading) return (<div></div>);

  if (!valid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
