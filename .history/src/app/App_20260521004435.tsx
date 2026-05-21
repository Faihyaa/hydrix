import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { sendFloodEmail } from "./utils/email"; // adjust if needed

export default function App() {
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

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}