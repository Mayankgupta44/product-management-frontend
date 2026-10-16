
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryManagement from "./CategoryManagement";
import ProductManagement from "./ProductManagement";
import { useAuth } from "../context/AuthContext";
import { logoutFromServer } from "../services/authService";

type DashboardTab = "categories" | "products";

function Dashboard() {
    const [activeTab, setActiveTab] = useState<DashboardTab>("categories");
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutFromServer();
        } catch (error) {
            console.error("Backend logout failed:", error);
        } finally {
            logout();
            navigate("/login", { replace: true });
        }
    };

    return (
        <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 sm:py-8">
            <div className="mx-auto max-w-7xl">
                <header className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="h-1.5 bg-blue-700" />

                    <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-700 text-white">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.8}
                                    stroke="currentColor"
                                    className="h-7 w-7"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.75 7.5 12 3l8.25 4.5L12 12 3.75 7.5Z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.75 12 12 16.5 20.25 12M3.75 16.5 12 21l8.25-4.5"
                                    />
                                </svg>
                            </div>

                            <div>
                                <p className="text-xs font-semibold tracking-wider text-blue-700">
                                    PRODUCT MANAGEMENT SYSTEM
                                </p>

                                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                                    Dashboard
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    Manage your products and categories in one place.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-100"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.8}
                                stroke="currentColor"
                                className="h-5 w-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M18 15l3-3m0 0-3-3m3 3H9"
                                />
                            </svg>
                            Logout
                        </button>
                    </div>
                </header>

                <section>
                    <div className="mb-6 rounded-xl border border-slate-200 bg-white px-3 pt-2 shadow-sm sm:px-5">
                        <nav
                            className="flex gap-2"
                            aria-label="Management sections"
                        >
                            <button
                                type="button"
                                onClick={() => setActiveTab("categories")}
                                aria-current={
                                    activeTab === "categories" ? "page" : undefined
                                }
                                className={`-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-100 sm:px-5 ${
                                    activeTab === "categories"
                                        ? "border-blue-700 text-blue-700"
                                        : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800"
                                }`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.8}
                                    stroke="currentColor"
                                    className="h-5 w-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4.5 6.75h15m-15 5.25h15m-15 5.25h15"
                                    />
                                </svg>
                                Categories
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab("products")}
                                aria-current={
                                    activeTab === "products" ? "page" : undefined
                                }
                                className={`-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-100 sm:px-5 ${
                                    activeTab === "products"
                                        ? "border-blue-700 text-blue-700"
                                        : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800"
                                }`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.8}
                                    stroke="currentColor"
                                    className="h-5 w-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M20.25 7.5 12 12m0 0L3.75 7.5M12 12v9"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m3.75 7.5 8.25-4.5 8.25 4.5v9L12 21l-8.25-4.5v-9Z"
                                    />
                                </svg>
                                Products
                            </button>
                        </nav>
                    </div>

                    {activeTab === "categories" && <CategoryManagement />}
                    {activeTab === "products" && <ProductManagement />}
                </section>

                <footer className="mt-8 border-t border-slate-200 py-4 text-center">
                    <p className="text-xs text-slate-500">
                        Product Management System
                        <span className="mx-2 text-slate-300">|</span>
                        Secure Administration Portal
                    </p>
                </footer>
            </div>
        </main>
    );
}

export default Dashboard;
