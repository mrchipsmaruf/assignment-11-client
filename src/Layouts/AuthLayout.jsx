import React from 'react';
import Navbar from '../Pages/Shared/Navbar/Navbar';
import { Outlet } from 'react-router';
import Footer from '../Pages/Shared/Footer/Footer';
import Loading from '../Components/Loading/Loading';
import UseAuth from '../Hooks/UseAuth';

const AuthLayout = () => {
    const { loading } = UseAuth();

    if (loading) {
        return <Loading />;
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

export default AuthLayout;
