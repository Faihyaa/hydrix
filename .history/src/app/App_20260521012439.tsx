import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { useEffect } from "react";
import { startFloodListener } from "./listener";
import { useAuth } from "./context/AuthContext";

const { user } = useAuth();

useEffect(() => {
  if (!user) return;

  startFloodListener({
    name: user.name,
    email: user.email,
    notifications: user.notifications,
  });
}, [user]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}