import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import UseAuth from "./UseAuth";

const useAdmin = () => {
    const { user, loading } = UseAuth();
    const axiosSecure = useAxiosSecure();

    const { data: isAdmin, isPending: adminLoading } = useQuery({
        enabled: !loading && !!user?.email,
        queryKey: ["isAdmin", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/role/${user.email}`);
            return res.data.role === "admin";
        }
    });

    return [isAdmin, adminLoading];
};

export default useAdmin;
