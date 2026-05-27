import { Navigate } from "react-router-dom";
import { getToken } from "./Auth";
import type React from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}