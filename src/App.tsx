import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { ManagementProvider } from "./context/ManagementContext";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route element={<ProtectedRoute />}>
                    <Route
                        path="/dashboard"
                        element={
                            <ManagementProvider>
                                <Dashboard />
                            </ManagementProvider>
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;