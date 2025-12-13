import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import UseAuth from "../../../Hooks/UseAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

export default function UserProfile() {
    const { user } = UseAuth();
    const axiosSecure = useAxiosSecure();

    const { data: membership = {} } = useQuery({
        queryKey: ["membership", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/membership/${user.email}`);
            return res.data;
        }
    });

    if (!user) return <p>Loading...</p>;

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">User Profile</h1>

            <div className="bg-white rounded-lg shadow p-6 flex gap-6">
                <img
                    src={user.photoURL}
                    alt="User"
                    className="w-24 h-24 rounded-full border"
                />

                <div>
                    <h2 className="text-xl font-semibold">{user.displayName}</h2>
                    <p className="text-gray-600">{user.email}</p>

                    <div className="mt-3">
                        <p className="font-semibold">
                            Membership:{" "}
                            <span className="text-blue-600">
                                {membership.status?.toUpperCase() || "FREE"}
                            </span>
                        </p>
                    </div>

                    {/* Upgrade Button (Only if FREE) */}
                    {membership.status !== "premium" && (
                        <Link to="/payment">
                            <button className="btn btn-primary mt-4">
                                Upgrade to Premium
                            </button>
                        </Link>
                    )}

                    {/* Show premium badge */}
                    {membership.status === "premium" && (
                        <div className="mt-4 bg-green-100 text-green-700 px-4 py-2 rounded shadow">
                            🌟 You are a Premium Member
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
