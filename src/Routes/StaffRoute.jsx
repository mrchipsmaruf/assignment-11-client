import { Navigate, useLocation } from "react-router-dom";
import UseAuth from "../Hooks/UseAuth";
import useRole from "../Hooks/useRole";
import Loading from "../Components/Loading/Loading";

const StaffRoute = ({ children }) => {
    const { user, loading } = UseAuth();
    const [role, roleLoading] = useRole();
    const location = useLocation();

    if (loading || roleLoading) {
        return <Loading />;
    }

    if (user && role === "staff") {
        return children;
    }

    return <Navigate to="/" state={{ from: location }} replace />;
};

export default StaffRoute;
