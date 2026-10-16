import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
    const { token, isInitializing } = useAuth();

    if (isInitializing) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-gray-600">Restoring session...</p>
            </div>
        );
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
