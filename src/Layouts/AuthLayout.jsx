import React, { useEffect, useState } from 'react';
import Navbar from '../Pages/Shared/Navbar/Navbar';
import { Outlet } from 'react-router';
import Footer from '../Pages/Shared/Footer/Footer';
import Loading from '../Components/Loading/Loading';

const AuthLayout = () => {
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
            <div className='pt-24'>
                <Navbar></Navbar>
            </div>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default AuthLayout;