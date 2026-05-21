
  import { createRoot } from "react-dom/client";
  import App from "./app/App";
  import "./styles/index.css";
 import { useEffect } from "react";
import { sendFloodEmail } from "./app/utils/email";

  createRoot(document.getElementById("root")!).render(<App />);

  function App() {
  useEffect(() => {
    const testEmail = async () => {
      await sendFloodEmail("warn", {
        name: "Test User",
        email: "your_email@gmail.com",
        message: "Testing EmailJS integration",
      });

      console.log("Email sent");
    };

    testEmail();
  }, []);

  return <div>Testing Email...</div>;
}

export default App;