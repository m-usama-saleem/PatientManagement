import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import App from './App';
import PMLogin from './pages/PMLogin';
import PMRegister from './pages/PMRegister';

const AppWrapper = () => {
    let location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <Routes>
            <Route path="/" element={<PMLogin />} />
            <Route path="/register" element={<PMRegister />} />
            <Route path="*" element={<App />} />
        </Routes>
    );
};

export default AppWrapper;
