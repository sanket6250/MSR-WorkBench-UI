import "../CSS/RouteLoader.css";

export default function RouteLoader() {
  return (
    <div className="route-loader-overlay">
      <div className="loader-box">
        <div className="loader-ring"></div>
        <p>Loading...</p>
      </div>
    </div>
  );
}
