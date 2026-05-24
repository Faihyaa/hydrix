
  import { createRoot } from "react-dom/client";
  import App from "./app/App";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(<App />);

  <button onClick={testSend}>Test Email</button>


  const testSend = async () => {
  await sendEmail("warn", {
    name: "Test User",
    email: "nurfaizah.or@gmail.com",
    message: "Testing EmailJS integration",
  });
};