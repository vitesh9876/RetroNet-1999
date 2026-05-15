import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { FileSystemProvider } from "./contexts/FileSystemContext";
import { SystemProvider } from "./contexts/SystemContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SystemProvider>
      <FileSystemProvider>
        <App />
      </FileSystemProvider>
    </SystemProvider>
  </React.StrictMode>,
);
