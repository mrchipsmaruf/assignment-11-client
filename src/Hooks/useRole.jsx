import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import UseAuth from "./UseAuth";

const useRole = () => {
    const { user, loading } = UseAuth();
    const axiosSecure = useAxiosSecure();

    const {
        data: role,
        isLoading,
        isFetching,
    } = useQuery({
        queryKey: ["role", user?.email],
        enabled: !loading && !!user?.email,
        staleTime: 0,
        retry: false,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/role/${user.email}`);
            return res.data.role;
        },
    });

    return {
        role: role || null,
        roleLoading: isLoading || isFetching,
    };
};

export default useRole;
