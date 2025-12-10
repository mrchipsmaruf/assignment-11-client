import React, { useState, useEffect } from "react";
import { Outlet } from "react-router";
import Navbar from "../Pages/Shared/Navbar/Navbar";
import Footer from "../Pages/Shared/Footer/Footer";
import Loading from "../Components/Loading/Loading";

const RootLayout = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading></Loading>;
  }

  return (
    <div>
      <div className="pt-24">
        <Navbar />
      </div>
      <Outlet />
      <Footer />
    </div>
  );
};

export default RootLayout;
