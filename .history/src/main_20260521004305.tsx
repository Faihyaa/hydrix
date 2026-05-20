import { useEffect } from "react";
import { sendFloodEmail } from "<div className="" />
<app></app>/email";

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