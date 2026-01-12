import { useContext, useEffect, useRef, useState } from 'react';
import { APP_CONSTANTS } from '../util/constant';

export const ChatBot = ()=>
{
    const [openChat, setOpenChat] = useState(false);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const [expanded, setExpanded] = useState(false);
    const [messages, setMessages] = useState([
    {
        role: "assistant",
        content: "Hi 👋 I’m MSR Assistant. How can I help you today?",
      },
    ]);

  const [provider, setProvider] = useState("openai");
  const aimlServiceURL = APP_CONSTANTS.AIML_SERVICE_END_POINT;

     const sendMessage = async () => {
          if (!input.trim()) return;

          const userMsg = { role: "user", content: input };
          setMessages((prev) => [...prev, userMsg]);
          setInput("");
          setLoading(true);

          try {
            const res = await fetch(aimlServiceURL + "chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                provider,
                message: input,
                history: messages,
              }),
            });

            const data = await res.json();

            setMessages((prev) => [
              ...prev,
              { role: "assistant", content: data.answer },
            ]);
          } catch(error) {
            console.log(error);
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: "⚠️ Something went wrong. Please try again.",
              },
            ]);
          } finally {
            setLoading(false);
          }
      };

    return(
        <>
        {/* CHATBOT FLOATING ICON */}
      <div
        onClick={() => setOpenChat(true)}
        style={{
          //position: "fixed",
          //bottom: 24,
          right: 24,
          width: 35,
          height: 35,
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
          bottom: expanded ? 24 : 90,
          right: 24,
          width: expanded ? "820px" : "440px",
          height: expanded ? "90vh" : "520px",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
          zIndex: 1001, 
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transition: "all 0.3s ease",
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

            <div className="d-flex gap-2">
              {/* Expand Button */}
              <button
                className="btn btn-sm btn-light"
                title={expanded ? "Collapse" : "Expand"}
                onClick={() => setExpanded((p) => !p)}
              >
                {expanded ? "🗕" : "🗖"}
              </button>

              {/* Close Button */}
              <button
                className="btn btn-sm btn-light"
                title='Close'
                onClick={() => {
                  setOpenChat(false);
                  setExpanded(false);
                }}
              >
                ✕
              </button>
            </div>
          </div>


          {/* BODY */}
          <div
            className="p-3 text-muted"
            style={{ flex: 1, fontSize: 14 ,overflow:'auto'}}
          >
            {/* Messages */}
            <div
              style={{
                flex: 1,
                padding: 16,
                overflowY: "auto",
                background: "#f9fafb",
              }}
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent:
                      m.role === "user" ? "flex-end" : "flex-start",
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      maxWidth: "80%",
                      padding: "10px 14px",
                      borderRadius: 14,
                      background:
                        m.role === "user" ? "#111827" : "#e5e7eb",
                      color: m.role === "user" ? "#fff" : "#000",
                      fontSize: 14,
                      lineHeight: 1.4,
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && <div>🤖 Thinking...</div>}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div
            style={{
              padding: 12,
              borderTop: "1px solid #e5e7eb",
              display: "flex",
              gap: 8,
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                fontSize: 14,
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                padding: "0 16px",
                borderRadius: 10,
                border: "none",
                background: "#111827",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
      </>
    )
}