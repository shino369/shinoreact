import { useSelector } from "react-redux";
import { Navigate, Route } from "react-router-dom";
import { RootState } from "store";

interface Props {
  component: any;
  protectedRoute: boolean;
}

const ProtectedRoute = ({ component, protectedRoute }: Props) => {
  const { user, isAuthenticated } = useSelector(
    (rootState: RootState) => rootState.auth
  );
  if (!isAuthenticated && protectedRoute) {
    return <Navigate to="/login" />;
  }
  return component;
};

export default ProtectedRoute;
