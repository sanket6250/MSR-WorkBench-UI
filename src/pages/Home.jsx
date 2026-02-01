import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppConetxt";
import {BGImages} from '../assets/BGImages';
import "../CSS/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);

  return (
    <div className="home-wrapper">

      {/* ================= HERO SECTION ================= */}
      <section className="hero">
        <div className="hero-inner">
          

          <p className="hero-greet">
            Hey {userData ? userData.name : "Developer"} 👋
          </p>

          <h1 className="hero-title">
            MSR Workbench
          </h1>

          <p className="hero-desc">
            A ready-to-use developer utility platform to build, manage,
            automate and scale your daily workflows with ease.
          </p>

          <button
            className="hero-btn"
            onClick={() => navigate("/login")}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="features">
       {/* <h2 className="section-title">What You Can Do</h2>  */}

        <div className="feature-grid">
          <div className="feature-card">
            <div className="icon">🧱</div>
            <h5>SQL Builder</h5>
            <p>
              Visually design tables, generate SQL, DAO & Bean files
              without writing boilerplate code.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon">📄</div>
            <h5>Document Extraction</h5>
            <p>
              Extract structured data from documents with accuracy
              and minimal effort.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon">📝</div>
            <h5>Text Manager</h5>
            <p>
              Clean, transform, compare and manage large text data
              efficiently.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon">🤖</div>
            <h5>AI / ML Q&A</h5>
            <p>
              Ask questions, analyze data and get intelligent insights
              powered by AI.
            </p>
          </div>
        </div>
      </section>

      {/* ================= ABOUT (OWNER) ================= */}
      <section className="about">
        <div className="about-container">

         {/* <h2 className="section-title"></h2> */} 

          <div className="about-box">

            <h3 className="owner-name">Sanket Mashalkar</h3>
            <p className="owner-desc">
              MSR Workbench is built to simplify everyday developer tasks.
              The goal is to provide ready-to-use utilities that save time,
              reduce boilerplate work, and improve productivity through
              smart automation tools.
            </p>

            <div className="owner-links">
              <a href="mailto:sanketmashalkar12@gmail.com" className="owner-link-icon" title="Email">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="currentColor"
                    >
                      <path d="M2 4h20v16H2V4zm10 9L22 6H2l10 7zm0 2l-10-7v12h20V8l-10 7z"/>
                    </svg>
              </a>
              <a href="https://www.linkedin.com/in/sanket-mashalkar/" target="_blank" className="owner-link-icon" title="LinkdIn" rel="noreferrer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="currentColor"
                    >
                        <path d="M19 0h-14C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.59c-1.14 0-2.06-.92-2.06-2.06s.92-2.06 2.06-2.06 2.06.92 2.06 2.06-.92 2.06-2.06 2.06zM20.45 20.45h-3.55v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7H9.32V9h3.41v1.56h.05c.48-.9 1.65-1.87 3.39-1.87 3.62 0 4.29 2.38 4.29 5.48v6.28z"/>
                    </svg>
              </a>
              <a href="https://github.com/SanketMashalkar" target="_blank" rel="noreferrer" className="owner-link-icon" title="GitHub">
                    <svg
                    height="24"
                    width="24"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.11 0 0 .67-.22 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.91.08 2.11.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                    </svg>
              </a>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
