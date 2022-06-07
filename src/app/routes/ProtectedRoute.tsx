import { useSelector } from "react-redux";
import { Navigate, Route } from "react-router-dom";
import { RootState } from "store";

interface Props {
  component: any;
  protectedRoute: boolean;
}

const ProtectedRoute = ({ component, protectedRoute }: Props) => {
  //    const { auth } = useSelector((rootState: RootState) => rootState.auth);
  const auth = false;
  if (!auth && protectedRoute) {
    return <Navigate to="/login" />;
  }
  return component;
};

export default ProtectedRoute;
