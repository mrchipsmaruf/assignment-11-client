import React, { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import UseAuth from "../../Hooks/UseAuth";
import Swal from "sweetalert2";

export default function PaymentPage() {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const { user } = UseAuth();

    const [loading, setLoading] = useState(false);

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);

        // Create PaymentIntent
        const { data } = await axiosSecure.post("/create-payment-intent", {
            email: user.email,
            amount: 500, // $5 membership
        });

        const clientSecret = data.clientSecret;

        const card = elements.getElement(CardElement);
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card,
                billing_details: { email: user.email },
            },
        });

        if (result.error) {
            Swal.fire("Payment Failed", result.error.message, "error");
            setLoading(false);
        } else {
            // Success — update user membership
            await axiosSecure.patch(`/users/membership/${user.email}`, {
                status: "premium",
            });

            Swal.fire("Success", "You are now a premium member!", "success");
            window.location.href = "/dashboard/profile";
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Upgrade to Premium</h1>

            <form onSubmit={handlePayment} className="p-4 bg-white rounded shadow">
                <p className="font-semibold mb-3">Premium Price: $5</p>

                <CardElement className="p-2 border rounded" />

                <button
                    disabled={!stripe || loading}
                    className="btn btn-primary w-full mt-4"
                >
                    {loading ? "Processing..." : "Pay Now"}
                </button>
            </form>
        </div>
    );
}
