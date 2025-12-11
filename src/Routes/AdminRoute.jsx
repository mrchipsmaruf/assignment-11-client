import { Navigate } from "react-router";
import UseAuth from "../Hooks/UseAuth";
import axios from "axios";
import { useEffect, useState } from "react";

const AdminRoute = ({ children }) => {
    let { user, loading } = UseAuth();
    let [isAdmin, setIsAdmin] = useState(null);

    useEffect(() => {
        if (user?.email) {
            axios.get(`http://localhost:3000/users/${user.email}`)
                .then(res => setIsAdmin(res.data?.role === "admin"))
        }
    }, [user]);

    if (loading || isAdmin === null) {
        return <div className="text-center text-xl">Checking permissions...</div>;
    }

    if (!isAdmin) {
        return <Navigate to="/" />;
    }

    return children;
};

export default AdminRoute;
