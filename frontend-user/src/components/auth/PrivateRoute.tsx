import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from "react-router-dom";
import api from "../../api/axios";
import { Loader2 } from "lucide-react";

const PrivateRoute: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [authenticated, setAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get('/profile');
                if (res.status === 200) {
                    setAuthenticated(true);
                } else {
                    setAuthenticated(false);
                }
            } catch (error) {
                setAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return authenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
