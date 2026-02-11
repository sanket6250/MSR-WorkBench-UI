import { useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { AppContext } from "../../../context/AppConetxt";
import { toast } from "react-toastify";

const BillUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const {setLoading} = useContext(AppContext);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const uploaded = acceptedFiles[0];
      setFile(uploaded);
      setPreview(URL.createObjectURL(uploaded));
    }
  });

  const handleExtract = async () => {
    if (!file) return;

    toast.success("Processing started!");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
        const res = await axios.post(
        "http://localhost/doc/bill/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
        );

        console.log(res.data);
        setLoading(false);
    } catch (err) {
        console.error(err);
        toast.error("Upload failed");
        setLoading(false);
    }
    };

  const styles = {
    wrapper: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
  container: {
    maxWidth: "800px",
    width:"600px",
    margin: "auto",
    padding: "30px",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center"
  },

  title: {
    marginBottom: "20px"
  },
  dropzone: {
    border: "2px dashed #4f46e5",
    borderRadius: "10px",
    padding: "40px 20px",
    cursor: "pointer",
    backgroundColor: "#f9fafb"
  },
  activeDropzone: {
    backgroundColor: "#eef2ff"
  },
  text: {
    fontSize: "16px",
    marginBottom: "8px"
  },
  subText: {
    fontSize: "12px",
    color: "#6b7280"
  },
  previewContainer: {
    marginTop: "20px"
  },
  previewImage: {
    maxWidth: "100%",
    maxHeight: "300px",
    borderRadius: "6px",
    border: "1px solid #e5e7eb"
  },
  button: {
    marginTop: "20px",
    padding: "10px 24px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#4f46e5",
    color: "#fff",
    cursor: "pointer"
  },
  disabledButton: {
    backgroundColor: "#9ca3af",
    cursor: "not-allowed"
  }
};

  return (

    <>
    <div style={styles.wrapper}>
        <div style={styles.container}>
        <h2 style={styles.title}>Upload Bill</h2>

        <div
            {...getRootProps()}
            style={{
            ...styles.dropzone,
            ...(isDragActive ? styles.activeDropzone : {})
            }}
        >
            <input {...getInputProps()} />
            <p style={styles.text}>
            {isDragActive
                ? "Drop the bill image here"
                : "Drag & drop bill image here, or click to upload"}
            </p>
            <span style={styles.subText}>
            Supported formats: JPG, PNG (Max 10MB)
            </span>
        </div>

        {preview && (
            <div style={styles.previewContainer}>
            <img src={preview} alt="Bill Preview" style={styles.previewImage} />
            </div>
        )}

        <button
            style={{
            ...styles.button,
            ...(file ? {} : styles.disabledButton)
            }}
            disabled={!file}
            onClick={handleExtract}
        >
            Extract Bill
        </button>
        </div>
    </div>
    </>
  );
};

export default BillUpload;
