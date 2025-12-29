import { Link } from "react-router-dom";
import Header from "../../../Header";
import { useEffect, useState } from "react";

export default function SQLBuilder() {

  const utilities = [
    {
      title: "Create Table",
      description: "Design and create new database tables visually.",
      icon: "bi-table",
      path: "/workbench/sql/CreateSQLTable",
    },
    {
      title: "Alter Table",
      description: "Add, modify, or remove columns from existing tables.",
      icon: "bi-pencil-square",
      path: "/workbench/sql/alter-table",
    },
    {
      title: "Drop Table",
      description: "Safely remove tables with confirmation & preview.",
      icon: "bi-trash",
      path: "/workbench/sql/drop-table",
    },
    {
      title: "Indexes",
      description: "Create and manage indexes for performance.",
      icon: "bi-lightning-charge",
      disabled: true,
    },
    {
      title: "Constraints",
      description: "Primary keys, foreign keys, and unique rules.",
      icon: "bi-shield-check",
      disabled: true,
    },
  ];

  const ACTIVE_UTILITY_KEY = "msr_active_sql_utility";
  const [activeUtility, setActiveUtility] = useState(() => {
  return (
    localStorage.getItem(ACTIVE_UTILITY_KEY) ||
    "/workbench/sql/CreateSQLTable"
  );
  });

  useEffect(() => {
  localStorage.setItem(ACTIVE_UTILITY_KEY, activeUtility);
  }, [activeUtility]);

  return (
    <>
      <div className="container-fluid px-4 py-4" style={{ maxWidth: 1200 }}>
        {/* HEADER */}
        <div className="mb-4">
          <h4 className="fw-bold mb-1">SQL Builder</h4>
          <p className="text-muted mb-0">
            Build and manage database structures without writing raw SQL.
          </p>
        </div>

        {/* UTILITIES GRID */}
        <div className="row g-4">
          {utilities.map((u) => {
            const isActive = u.path === activeUtility;

            return (
              <div className="col-md-4 col-sm-6" key={u.title}>
                <div
                  className={`card h-100 rounded-3 border ${
                    u.disabled ? "opacity-50" : ""
                  }`}
                  style={{
                    boxShadow: isActive
                      ? "0 12px 28px rgba(0,0,0,0.18)"
                      : "0 4px 10px rgba(0,0,0,0.08)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div className="card-body p-4 d-flex flex-column" style={{background: 'bisque'}}>
                    {/* ICON */}
                    <div
                      className="d-flex align-items-center justify-content-center mb-3"
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: isActive
                          ? "rgba(0,0,0,0.85)"
                          : "rgba(0,0,0,0.06)",
                        color: isActive ? "#fff" : "#000",
                      }}
                    >
                      <i className={`${u.icon} fs-4`} />
                    </div>

                    {/* CONTENT */}
                    <h6 className="fw-semibold mb-1">{u.title}</h6>
                    <p className="text-muted small mb-4">
                      {u.description}
                    </p>

                    {/* CTA */}
                    {u.disabled ? (
                      <span className="small fst-italic mt-auto">
                        Coming soon
                      </span>
                    ) : (
                      <Link
                        to={u.path}
                        onClick={() => setActiveUtility(u.path)}
                        className={`btn btn-sm mt-auto ${
                          isActive
                            ? "btn-dark"
                            : "btn-outline-secondary"
                        }`}
                      >
                        {isActive ? "Opened" : "Open"}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="text-muted small mt-4">
          More SQL utilities will appear here as they become available.
        </div>
      </div>
    </>
  );
}
