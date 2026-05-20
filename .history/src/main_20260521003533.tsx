
  import { createRoot } from "react-dom/client";
  import App from "./app/App";
  import "./styles/index.css";
  import { sendFloodEmail } from "./app/utils/email";

  createRoot(document.getElementById("root")!).render(<App />);

 
  const testSend = async () => {
  await sendFloodEmail("warn", {
    name: "Test User",
    email: "nurfaizah.or@gmail.com",
    message: "Testing EmailJS integration",
  });
};