import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './fonts.css';
import './index.css';
import { RouterProvider } from "react-router/dom";
import { router } from './Routes/Router';
import AuthProvider from './Context/AuthContext/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const queryClient = new QueryClient();

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>

        <Elements stripe={stripePromise}>
          <RouterProvider router={router} />
        </Elements>

      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
