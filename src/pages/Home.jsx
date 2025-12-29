import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppConetxt";

const Home = ()=>  {
  const navigate = useNavigate();
  const {userData} = useContext(AppContext);

  return (
    <>
      {/* MAIN LANDING CONTENT */}
      <div
        className="text-center d-flex flex-column align-items-center justify-content-center py-5 px-3"
        style={{ minHeight: '-webkit-fill-available' }}
      >
        <img
          src={assets.logo_home}
          alt="Header"
          width={120}
          className="mb-4"
        />

        <h5 className="fw-semibold">
          Hey {userData ? userData.name : "User"} 👋
        </h5>

        <h1 className="fw-bold display-5 mb-3">
          Welcome to MSR Workbench
        </h1>

        <p
          className="text-muted fs-5 mb-4"
          style={{ maxWidth: "500px" }}
        >
          Build, manage, and automate your workflows effortlessly.
          Let’s start with a quick trial!
        </p>

        <button
          className="btn btn-outline-dark rounded-pill px-4 py-2"
          onClick={() => navigate("/login")}
        >
          Get Started
        </button>
      </div>
    </>
  );
}

export default Home;
