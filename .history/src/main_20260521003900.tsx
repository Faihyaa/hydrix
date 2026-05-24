
  import { createRoot } from "react-dom/client";
  import App from "./app/App";
  import "./styles/index.css";
  import { sendFloodEmail } from "./app/utils/email";

  createRoot(document.getElementById("root")!).render(<App />);
