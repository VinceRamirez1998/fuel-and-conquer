// import { useAuth } from "@/context/AuthProvider";
import { useEffect } from "react";
import {
  Outlet,
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { LoginForm } from "./components/login-form";
import App from "./App";
import { useAuth } from "./auth/Authprovider";
import { ResetPasswordForm } from "@/components/ui/reset-password"
import { ResetPasswordConfirm } from "@/components/ui/reset-password-confirm"
export const AppRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, loading } = useAuth();

  useEffect(() => {
    console.log(user)



    if (user && location.pathname === "/") {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, location.pathname, user]);



  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<App />} />
      </Route>
      <Route path="/forgot-password" element={<ResetPasswordForm />} />
      <Route path="/reset-password/:code" element={<ResetPasswordConfirm />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
       <Outlet />
  );
};