import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { App } from "./components/App";
import { WebflowProvider } from "./context/WebflowContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./index.css";

// Wrapper component to set extension size
const AppWithSize: React.FC = () => {
  useEffect(() => {
    // Set extension size to large on mount
    if (typeof webflow !== 'undefined') {
      webflow.setExtensionSize("large").catch((err) => {
        console.error('Failed to set extension size:', err);
      });
    }
  }, []);

  return (
    <ErrorBoundary>
      <WebflowProvider>
        <App />
      </WebflowProvider>
    </ErrorBoundary>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<AppWithSize />);
