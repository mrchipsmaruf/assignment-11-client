import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../Services/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

export default function IssueDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({});

    // Fetch single issue
    const { data: issue, isLoading } = useQuery({
        queryKey: ["issueDetails", id],
        queryFn: async () => {
            const res = await API.get(`/issues/details/${id}`);
            return res.data;
        }
    });

    if (isLoading) return <div className="p-5 text-center">Loading issue details...</div>;
    if (!issue) return <div className="p-5 text-center text-red-600">Issue not found.</div>;

    // Handle Delete
    const handleDelete = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "This issue will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await API.delete(`/issues/${id}`);

                queryClient.invalidateQueries(["myIssues"]); // update UI instantly
                Swal.fire("Deleted!", "Your issue has been removed.", "success");
                navigate("/dashboard/my-issues");
            }
        });
    };

    // Open Edit Modal
    const openEditModal = () => {
        setEditData(issue);
        setEditModalOpen(true);
    };

    // Handle Edit Submit
    const handleEditSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData(e.target);
        const updated = Object.fromEntries(form.entries());

        Swal.fire({ title: "Updating...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });

        await API.patch(`/issues/edit/${id}`, updated);

        Swal.fire("Updated!", "Issue updated successfully.", "success");

        queryClient.invalidateQueries(["issueDetails", id]);
        queryClient.invalidateQueries(["myIssues"]);

        setEditModalOpen(false);
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">

            <h2 className="text-2xl font-bold mb-4">Issue Details</h2>

            {/* Image */}
            {issue.image && (
                <img src={issue.image} alt={issue.title} className="w-full rounded-lg mb-4" />
            )}

            <h3 className="text-xl font-semibold mb-2">{issue.title}</h3>

            <p className="text-gray-700">
                <strong>Description:</strong> {issue.description}
            </p>

            <p className="mt-2 text-gray-700">
                <strong>Category:</strong> {issue.category}
            </p>

            <p className="mt-2 text-gray-700">
                <strong>Location:</strong> {issue.location}
            </p>

            <p className="mt-2">
                <strong>Status:</strong>{" "}
                <span className={`px-2 py-1 rounded text-white text-xs ${issue.status === "pending"
                    ? "bg-yellow-500"
                    : issue.status === "in-progress"
                        ? "bg-blue-500"
                        : "bg-green-600"
                    }`}>
                    {issue.status}
                </span>
            </p>

            <p className="mt-2 text-gray-600">
                <strong>Reported:</strong> {issue.reportedAt}
            </p>

            {/* Timeline */}
            <h3 className="text-xl font-semibold mt-6 mb-3">Timeline</h3>
            <div className="border rounded p-4 bg-gray-50">
                {issue.timeline?.map((t, i) => (
                    <div key={i} className="mb-3 border-b pb-2">
                        <p><strong>Status:</strong> {t.status}</p>
                        <p><strong>Message:</strong> {t.message}</p>
                        <p className="text-sm text-gray-500">
                            {new Date(t.date).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
                {issue.status === "pending" && (
                    <button
                        onClick={openEditModal}
                        className="btn btn-warning btn-sm"
                    >
                        Edit Issue
                    </button>
                )}

                <button
                    onClick={handleDelete}
                    className="btn btn-error btn-sm"
                >
                    Delete Issue
                </button>
            </div>

            {/* -------- Edit Modal -------- */}
            {editModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <form
                        onSubmit={handleEditSubmit}
                        className="bg-white p-6 rounded-lg shadow w-96"
                    >
                        <h3 className="text-lg font-bold mb-4">Edit Issue</h3>

                        <label className="block mb-2">Title</label>
                        <input
                            name="title"
                            className="input input-bordered w-full"
                            defaultValue={editData.title}
                        />

                        <label className="block mt-3 mb-2">Description</label>
                        <textarea
                            name="description"
                            className="textarea textarea-bordered w-full"
                            rows={4}
                            defaultValue={editData.description}
                        />

                        <label className="block mt-3 mb-2">Location</label>
                        <input
                            name="location"
                            className="input input-bordered w-full"
                            defaultValue={editData.location}
                        />

                        <div className="flex justify-end gap-2 mt-5">
                            <button
                                type="button"
                                onClick={() => setEditModalOpen(false)}
                                className="btn btn-sm"
                            >
                                Cancel
                            </button>

                            <button type="submit" className="btn btn-primary btn-sm">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
