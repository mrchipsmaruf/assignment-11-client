import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../Components/Loading/Loading";
import Swal from "sweetalert2";

export default function AdminAssignStaff() {
    const axiosSecure = useAxiosSecure();
    const qc = useQueryClient();

    // Fetch issues (admin sees everything)
    const { data: issues = [], isLoading: issuesLoading, refetch } = useQuery({
        queryKey: ["admin:issues"],
        queryFn: async () => {
            const res = await axiosSecure.get("/issues");
            return res.data?.items || res.data || [];
        }
    });

    // Fetch staff list
    const { data: staffList = [], isLoading: staffLoading } = useQuery({
        queryKey: ["admin:staff"],
        queryFn: async () => {
            const res = await axiosSecure.get("/staff");
            return res.data || [];
        }
    });

    // Assign mutation
    const assignMutation = useMutation({
        mutationFn: async ({ issueId, staffEmail }) => {
            return axiosSecure.patch(`/issues/${issueId}/assign`, { staffEmail });
        },
        onSuccess: () => {
            qc.invalidateQueries(["admin:issues"]);
            Swal.fire("Assigned", "Staff successfully assigned to the issue.", "success");
        },
        onError: (err) => {
            Swal.fire("Error", err?.response?.data?.message || "Assign failed", "error");
        },
    });

    if (issuesLoading || staffLoading) return <Loading />;

    // Extract only unassigned issues
    const unassigned = issues.filter((i) => !i.assignedStaff);

    // Assign handler
    const handleAssign = async (issueId) => {
        if (!staffList.length) {
            return Swal.fire("No Staff", "There are no staff users to assign.", "info");
        }

        const inputOptions = staffList.reduce((acc, user) => {
            acc[user.email] = `${user.name || "Unnamed"} (${user.email})`;
            return acc;
        }, {});

        const { value: staffEmail } = await Swal.fire({
            title: "Assign staff",
            input: "select",
            inputOptions,
            inputPlaceholder: "Select staff to assign",
            showCancelButton: true,
        });

        if (!staffEmail) return;

        const confirm = await Swal.fire({
            title: "Confirm assignment",
            html: `Assign <b>${staffEmail}</b> to this issue?`,
            icon: "question",
            showCancelButton: true,
        });

        if (!confirm.isConfirmed) return;

        assignMutation.mutate({ issueId, staffEmail });
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Assign Staff to Issues</h1>

            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                    Only <b>unassigned</b> issues are shown below.
                </p>
                <button className="btn btn-sm" onClick={() => refetch()}>
                    Refresh
                </button>
            </div>

            <div className="overflow-x-auto bg-white rounded shadow p-4">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Reporter</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Assigned To</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {unassigned.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center text-gray-500 py-6">
                                    All issues are assigned. (Try refreshing)
                                </td>
                            </tr>
                        )}

                        {unassigned.map((issue) => (
                            <tr key={issue._id}>
                                <td className="font-semibold">{issue.title}</td>
                                <td>{issue.reporterEmail}</td>
                                <td>{issue.category || "-"}</td>

                                {/* Status */} 
                                <td>
                                    <span
                                        className={`px-2 py-1 rounded text-xs text-white ${
                                            issue.status === "pending"
                                                ? "bg-yellow-500"
                                                : issue.status === "in-progress"
                                                ? "bg-blue-500"
                                                : issue.status === "resolved"
                                                ? "bg-green-600"
                                                : "bg-gray-500"
                                        }`}
                                    >
                                        {issue.status}
                                    </span>
                                </td>

                                {/* Priority */}
                                <td>
                                    <span
                                        className={`px-2 py-1 rounded text-xs text-white ${
                                            issue.priority === "high" ? "bg-red-600" : "bg-gray-600"
                                        }`}
                                    >
                                        {issue.priority || "normal"}
                                    </span>
                                </td>

                                <td>{issue.assignedStaff || "Unassigned"}</td>

                                <td className="flex gap-2">
                                    <button
                                        className="btn btn-sm btn-warning"
                                        onClick={() => handleAssign(issue._id)}
                                    >
                                        Assign
                                    </button>

                                    <button
                                        className="btn btn-sm"
                                        onClick={() => window.open(`/dashboard/issue/${issue._id}`, "_blank")}
                                        title="Open issue details"
                                    >
                                        View
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
