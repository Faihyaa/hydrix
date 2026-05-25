import { RouterProvider } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import ForgotPassword from './pages/ForgotPassword';
//import { useEffect } from "react";
//import { startFloodListener } from "./listener";



function AppContent() {
  const { user } = useAuth();

  /*useEffect(() => {
    if (!user) return;

    startFloodListener({
      name: user.name,
      email: user.email,
      notifications: user.notifications,
    });
  }, [user]);*/

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}