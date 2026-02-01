import { useContext, useState } from "react";
import {validateIdentifier,isSizeRequired,enforceSinglePrimaryKey,} from "../util/sqlValidators";
import { generateCreateTableSQL } from "../util/sqlGenerator";
import { DATA_TYPES ,CONSTRAINT_OPTIONS ,DB_LIMITS } from "../util/sqlConstants";
import Header from "../../../Header";
import '../css/sqlCSS.css'
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../../../../context/AppConetxt";

export default function CreateSQLTable() {
  const [dbType, setDbType] = useState("postgres");
  const [tableName, setTableName] = useState("");
  const [columns, setColumns] = useState([
    {
      name: "",
      type: "VARCHAR",
      size: "",
      constraints: [],
      refTable: "",
      refColumn: "",
    },
  ]);

const updateColumn = (index, field, value) => {
  let updated = [...columns];

  if (field === "constraints") {
    // If user selects "None" → clear all constraints
    if (value.includes("None")) {
      updated[index] = {
        ...updated[index],
        constraints: [],
        refTable: "",
        refColumn: "",
      };
      setColumns(updated);
      return;
    }

    // Enforce only one PRIMARY KEY across columns
    updated = enforceSinglePrimaryKey(
      updated,
      index,
      value
    );
  }

  updated[index] = {
    ...updated[index],
    [field]: value,
    ...(field === "type" &&
      !isSizeRequired(value) && { size: "" }),
  };

  setColumns(updated);
};


  const addColumn = () =>
    setColumns([
      ...columns,
      {
        name: "",
        type: "VARCHAR",
        size: "",
        constraints: [],
        refTable: "",
        refColumn: "",
      },
    ]);

  const{backendURL} = useContext(AppContext);

  const generateSQLScript = async ()=>
  {
    /* Client Side 
      const sql = sqlPreview();
      if (!sql) return toast.error('Please fill required data !');

      const fileName = `${tableName || "create_table"}`.toUpperCase()+`_${dbType}`.toUpperCase()+`.sql`;

      const blob = new Blob([sql], { type: "text/sql;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      */

    try{
          //Profile Details API
          const response =  await axios.post(`${backendURL}/generateSQL` , {dbType ,tableName , columns} ,{  responseType: "blob", withCredentials: true, validateStatus: () => true });
          if(response.status == 200)
          {
             // Create file blob
             const blob = new Blob([response.data], { type: "application/zip" });
             // Create temporary URL
             const url = window.URL.createObjectURL(blob);
             // Create anchor and trigger download
             const link = document.createElement("a");
             link.href = url;
             link.download = "GeneratedCode.zip";
             document.body.appendChild(link);
             link.click();

             // Cleanup
             link.remove();
             window.URL.revokeObjectURL(url);
          }
          else
          {
              toast.error("Download failed.");
          }
        }
        catch(error)
        {
            toast.error("Download failed." , error.message);
        }

  }   

  const removeColumn = (i) =>
    setColumns(columns.filter((_, idx) => idx !== i));

  const sqlPreview = ()=>  { return generateCreateTableSQL(
    tableName,
    columns
  )};

return ( 
      <>
        <div className="container-fluid px-4 py-4" style={{ maxWidth: 1150 }}>
      {/* HEADER */}
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Create Table</h4>
        <p className="text-muted mb-0">
          Visually design your schema and generate SQL instantly
        </p>
      </div>

      <div
        className="card border-0 rounded-4"
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
        }}
      >
        <div className="card-body p-4">
          {/* DB + TABLE */}
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Database</label>
              <select
                className="form-select"
                value={dbType}
                onChange={(e) => setDbType(e.target.value)}
              >
                <option value="postgres">PostgreSQL</option>
                <option value="mysql">MySQL</option>
                <option value="mssql">MSSQL</option>
                <option value="oracle">Oracle</option>
              </select>
            </div>

            <div className="col-md-8">
              <label className="form-label fw-semibold">Table Name</label>
              <input
                className="form-control"
                placeholder="TABLE_NAME"
                value={tableName}
                onChange={(e) => setTableName(e.target.value.toUpperCase())}
              />
              <small className="text-danger">
                {validateIdentifier(tableName, DB_LIMITS[dbType].table)}
              </small>
            </div>
          </div>

          {/* COLUMN HEADER */}
          <div
            className="row text-muted small fw-semibold py-2 px-2 rounded-2 mb-3"
            style={{
              background: "linear-gradient(90deg, #f1f5f9, #f8fafc)",
            }}
          >
            <div className="col-3">Column</div>
            <div className="col-2">Type</div>
            <div className="col-2">Size</div>
            <div className="col-4">Constraints</div>
            <div className="col-1"></div>
          </div>

          {/* COLUMNS */}
          {columns.map((col, i) => (
            <div
              key={i}
              className="row g-2 align-items-stretch mb-3 px-2 py-3 rounded-3 column-row"
              style={{
                background: "#ffffff",
                boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                transition: "all 0.2s ease",
              }}
            >
              {/* COLUMN NAME */}
              <div className="col-3">
                <input
                  className="form-control form-control-sm"
                  placeholder="COLUMN_NAME"
                  value={col.name}
                  onChange={(e) =>
                    updateColumn(i, "name", e.target.value.toUpperCase())
                  }
                />
                <small className="text-danger">
                  {validateIdentifier(col.name, DB_LIMITS[dbType].column)}
                </small>
              </div>

              {/* TYPE */}
              <div className="col-2">
                <select
                  className="form-select form-select-sm"
                  value={col.type}
                  onChange={(e) => updateColumn(i, "type", e.target.value)}
                >
                  {DATA_TYPES[dbType].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* SIZE */}
              <div className="col-2">
                <input
                  className="form-control form-control-sm"
                  placeholder="Size"
                  disabled={!isSizeRequired(col.type)}
                  value={col.size}
                  onChange={(e) => updateColumn(i, "size", e.target.value)}
                />
              </div>

              {/* CONSTRAINTS */}
              <div className="col-4">
                <select
                  multiple
                  className="form-select form-select-sm"
                  value={col.constraints}
                  onChange={(e) =>
                    updateColumn(
                      i,
                      "constraints",
                      Array.from(e.target.selectedOptions, (o) => o.value)
                    )
                  }
                >
                  {CONSTRAINT_OPTIONS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>

                {col.constraints.includes("FOREIGN KEY") && (
                  <div className="d-flex gap-2 mt-2">
                    <input
                      className="form-control form-control-sm"
                      placeholder="Ref Table"
                      value={col.refTable}
                      onChange={(e) =>
                        updateColumn(i, "refTable", e.target.value.toUpperCase())
                      }
                    />
                    <input
                      className="form-control form-control-sm"
                      placeholder="Ref Column"
                      value={col.refColumn}
                      onChange={(e) =>
                        updateColumn(i, "refColumn", e.target.value.toUpperCase())
                      }
                    />
                  </div>
                )}
              </div>

              {/* DELETE */}
              <div className="col-1 d-flex align-items-center justify-content-center">
                {columns.length > 1 && (
                  <button
                    className="btn btn-sm btn-outline-danger rounded-circle"
                    onClick={() => removeColumn(i)}
                    title="Remove column"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* ADD COLUMN */}
          <div className="mt-3">
            <button
              className="btn btn-sm btn-outline-secondary rounded-pill"
              onClick={addColumn}
            >
              + Add Column
            </button>
          </div>

          {/* SQL PREVIEW */}
          <div className="mt-4">
            <label className="form-label fw-semibold">SQL Preview</label>
            <textarea
              className="form-control font-monospace"
              rows={6}
              readOnly
              style={{
                background: "#0f172a",
                color: "#e5e7eb",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)",
              }}
              value={sqlPreview()}
            />
          </div>

          {/* ACTION */}
          <div className="d-flex justify-content-end mt-4">
            <button
              className="btn btn-primary px-4 py-2 rounded-pill"
              style={{
                boxShadow: "0 10px 20px rgba(37,99,235,0.35)",
              }}
              onClick={generateSQLScript}
            >
              Generate Script
            </button>
          </div>
        </div>
      </div>
    </div>
      </>  
);

}
