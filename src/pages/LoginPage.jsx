import React, { useEffect } from 'react';
import LoginPanel from '../components/LoginPanel';
import toast from 'react-hot-toast';

const LoginPage = ({ setUserRole }) => {

    // Immediately set admin role when page loads
    useEffect(() => {
        const adminRole = 'admin';
        localStorage.setItem('token', 'dummy-token'); // fake token
        localStorage.setItem('userRole', adminRole);
        setUserRole(adminRole);
        toast.success('Logged in as Admin (bypassed login)');
    }, [setUserRole]);

    return <LoginPanel handleLogin={() => {}} />; // handleLogin does nothing
};

export default LoginPage;
