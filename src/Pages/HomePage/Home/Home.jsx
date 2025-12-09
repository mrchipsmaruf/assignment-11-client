import React from 'react';
import Banner from '../Banner/Banner';
import Feature from '../Features/Features';
import HowItWorks from '../HowItWorks/HowItWorks';
import Testimonials from '../Testimonials/Testimonials';
import SafetyTips from '../SafetyTips/SafetyTips';

const Home = () => {
    return (
        <div>
            <Banner />
            <Feature />
            <HowItWorks />
            <SafetyTips />
            <Testimonials />
        </div>
    );
};

export default Home;
