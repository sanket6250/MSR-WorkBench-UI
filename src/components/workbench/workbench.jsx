import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppConetxt";

const Workbench = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);

  const tools = [
    { name: "SQL Builder", icon: "bi-database", path: "/home/sqlBuilder" },
    { name: "Document Extraction", icon: "bi-file-earmark-text", path: "/home/doc-extract" },
    { name: "Resume Builder", icon: "bi-person-lines-fill", path: "/home/resume-builder" },
    { name: "Text Manager", icon: "bi-journal-text", disabled: true },
  ];

  return (
    <>
    <style>{`.focus-wrap {
                text-align: center;
                padding: 80px 10%;
                }

                /* HERO */
                .hero h1 {
                font-size: 38px;
                font-weight: 600;
                margin-bottom: 10px;
                color: #0f172a;
                }

                .hero p {
                color: #64748b;
                font-size: 18px;
                margin-bottom: 60px;
                }

                /* GRID */
                .tool-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 30px;
                margin-bottom: 60px;
                }

                /* CARDS */
                .tool-card {
                background: white;
                padding: 40px 20px;
                border-radius: 18px;
                box-shadow: 0 12px 30px rgba(0,0,0,0.08);
                transition: all 0.25s ease;
                cursor: pointer;
                }

                .tool-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 18px 45px rgba(0,0,0,0.12);
                }

                .tool-card i {
                font-size: 34px;
                margin-bottom: 16px;
                color: #0053a5;
                }

                .tool-card span {
                display: block;
                font-weight: 500;
                font-size: 17px;
                }

                /* DISABLED */
                .tool-card.disabled {
                opacity: 0.4;
                cursor: not-allowed;
                transform: none !important;
                }

                /* STATUS LINE */
                .status-line {
                font-size: 14px;
                color: #22c55e;
                font-weight: 500;
                }
            `}</style>
    <div className="focus-wrap">
      <div className="tool-grid">
        {tools.map((tool, i) => (
          <div
            key={i}
            className={`tool-card ${tool.disabled ? "disabled" : ""}`}
            onClick={() => !tool.disabled && navigate(tool.path)}
          >
            <i className={`bi ${tool.icon}`}></i>
            <span>{tool.name}</span>
          </div>
        ))}
      </div>

      <div className="status-line">
        ⚡ Your AI workspace is ready
      </div>

    </div>
    </>
  );
};

export default Workbench;
