import React from "react";
import { Navigate } from "react-router-dom";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  // ვკითხულობთ მომხმარებლის მონაცემებს localStorage-დან (ან გლობალური კონტექსტიდან)
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // ვამოწმებთ არის თუ არა ავტორიზებული და აქვს თუ არა admin როლი
  const isAdmin = user && user.role === "admin";

  // თუ ადმინია, ვუშვებთ ადმინ პანელში, თუ არა - ვაბრუნებთ მთავარზე ან ლოგინზე
  return isAdmin ? <>{children}</> : <Navigate to="/" replace />;
};

export default AdminRoute;
