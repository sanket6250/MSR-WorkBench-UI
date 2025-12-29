import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppConetxt";

const Content = ()=>  {
  const navigate = useNavigate();
  const [openChat, setOpenChat] = useState(false);
  const {userData} = useContext(AppContext);

  return (
    <>
      {/* MAIN LANDING CONTENT */}
      <div
        className="text-center d-flex flex-column align-items-center justify-content-center py-5 px-3"
        style={{ minHeight: "80vh" }}
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

      {/* CHATBOT FLOATING ICON */}
      <div
        onClick={() => setOpenChat(true)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #111827, #1f2937)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          cursor: "pointer",
          boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
          zIndex: 1000,
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "scale(1.08)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "scale(1)")
        }
      >
        <i className="bi bi-chat-dots-fill fs-4" title="Assistant"></i>
      </div>

      {/* CHATBOT POPUP */}
      {openChat && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            right: 24,
            width: 340,
            height: 420,
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
            zIndex: 1001,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* HEADER */}
          <div
            className="d-flex justify-content-between align-items-center px-3 py-2"
            style={{
              background: "linear-gradient(135deg, #111827, #1f2937)",
              color: "#fff",
            }}
          >
            <span className="fw-semibold">MSR Assistant</span>
            <button
              className="btn btn-sm btn-light"
              onClick={() => setOpenChat(false)}
            >
              ✕
            </button>
          </div>

          {/* BODY */}
          <div
            className="p-3 text-muted"
            style={{ flex: 1, fontSize: 14 }}
          >
            👋 Hi! I’m your MSR Assistant.  
            <br />
            <br />
            Ask me about:
            <ul>
              <li>DAO Builder</li>
              <li>SQL Utilities</li>
              <li>Workbench features</li>
            </ul>
          </div>

          {/* INPUT */}
          <div className="p-2 border-top">
            <input
              className="form-control form-control-sm"
              placeholder="Type your question..."
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Content;
