
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  console.log("=== MAIN.TSX RUNNING ===");
  try {
    const rootEl = document.getElementById("root");
    console.log("Root element:", rootEl);
    if (!rootEl) {
      console.error("Root element not found!");
    } else {
      const root = createRoot(rootEl);
      root.render(<App />);
      console.log("Root rendered!");
    }
  } catch (err) {
    console.error("Crash during mounting:", err);
  }
  