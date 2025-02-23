
import { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "./Header";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
  const { session } = useAuth();

  if (!session) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen flex-col">
      <Header />
      {children}
    </div>
  );
};

export default PrivateRoute;
