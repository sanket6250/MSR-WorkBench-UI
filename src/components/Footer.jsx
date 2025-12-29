import { useContext, useEffect, useRef, useState } from 'react';
const Footer = ()=>
{
    const [openChat, setOpenChat] = useState(false);
    return(
        <>
        <div style={{width: '100%',bottom: '0'}}>
        <hr style={{margin:'5px' ,  opacity: '0.10'}} />
     
        {/* CHATBOT FLOATING ICON */}
      <div
        onClick={() => setOpenChat(true)}
        style={{
          //position: "fixed",
          //bottom: 24,
          right: 24,
          width: 50,
          height: 50,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #111827, #1f2937)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          cursor: "pointer",
          boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
          zIndex: 1000,
         // transition: "transform 0.2s ease",
          float: 'inline-end',
          position: 'relative',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "scale(1.02)")
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
            <div style={{alignItems: 'center', position: 'relative',display: 'flex',justifyContent: 'center',height: '100%'}}>Ask me anything</div>
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
      </div>
        </>
    );
}

export default Footer;