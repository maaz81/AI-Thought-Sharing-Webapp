import React from 'react'
import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from 'react'
import api from "../../api/axios";

const PrivateRoute = () => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get('/profile');
                if (res.status === 200) {
                    setAuthenticated(true);
                }
                else {
                    setAuthenticated(false);
                }
            } catch (error) {
                setAuthenticated(false);
            } finally {
                setLoading(false);
            }
        }
        checkAuth();
    }, [])

    if (loading) {
        return <p>Loading...</p>;  // Or show spinner
    }

    return authenticated ? <Outlet /> : <Navigate to="/signup" />;
}

export default PrivateRoute