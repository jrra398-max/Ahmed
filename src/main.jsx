import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function App() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "#050505",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        fontSize: "40px",
        letterSpacing: "8px",
      }}
    >
      NOIR
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <App />
);
