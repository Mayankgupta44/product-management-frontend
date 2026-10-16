import {useState, type FormEvent} from "react";
import {Link, useNavigate} from "react-router-dom";
import {getApiErrorMessage} from "../utils/apiError";
import {signupUser} from "../services/authService";
import {
    validateName,
    validateEmail,
    validatePassword
} from "../utils/validation";

function Signup() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        const errors = {
            name: validateName(name),
            email: validateEmail(email),
            password: validatePassword(password),
            confirmPassword:
                !confirmPassword
                    ? "Please confirm your password"
                    : password !== confirmPassword
                        ? "Passwords do not match"
                        : ""
        };

        setFieldErrors(errors);

        if (Object.values(errors).some((message) => message !== "")) {
            return;
        }

        setLoading(true);

        try {
            await signupUser({
                name: name.trim(),
                email: email.trim(),
                password
            });

            setSuccess(
                "Account created successfully. Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (err: unknown) {
            setError(
                getApiErrorMessage(
                    err,
                    "Signup failed. Please check your details and try again."
                )
            );
        } finally {
            setLoading(false);
        }
    };


    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
            <section
                className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
                <div className="h-1.5 bg-blue-700"/>

                <div className="p-6 sm:p-8">
                    <div className="mb-6 flex items-center gap-3">
                        <div
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-700 text-white">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.8}
                                stroke="currentColor"
                                className="h-6 w-6"
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
                            <h2 className="text-lg font-bold tracking-tight text-slate-900">
                                Product Management
                            </h2>
                            <p className="mt-0.5 text-xs font-medium text-slate-500">
                                ADMINISTRATION PORTAL
                            </p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-slate-900">
                            Create your account
                        </h1>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Register to manage products and categories.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-2"
                    >
                        <label
                            htmlFor="name"
                            className="text-sm font-semibold text-slate-700"
                        >
                            Full name
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Enter your full name"
                            autoComplete="name"
                            maxLength={50}
                            className="mb-2 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />

                        {fieldErrors.name && (
                            <p className="-mt-3 mb-2 text-sm text-red-600" role="alert">
                                {fieldErrors.name}
                            </p>
                        )}

                        <label
                            htmlFor="signup-email"
                            className="text-sm font-semibold text-slate-700"
                        >
                            Email address
                        </label>

                        <input
                            id="signup-email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="name@company.com"
                            autoComplete="email"
                            className="mb-2 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />

                        {fieldErrors.email && (
                            <p className="-mt-3 mb-2 text-sm text-red-600" role="alert">
                                {fieldErrors.email}
                            </p>
                        )}

                        <label
                            htmlFor="signup-password"
                            className="text-sm font-semibold text-slate-700"
                        >
                            Password
                        </label>

                        <input
                            id="signup-password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Create a password"
                            autoComplete="new-password"
                            className="mb-2 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />

                        {fieldErrors.password && (
                            <p className="-mt-3 mb-2 text-sm text-red-600" role="alert">
                                {fieldErrors.password}
                            </p>
                        )}

                        <label
                            htmlFor="confirm-password"
                            className="text-sm font-semibold text-slate-700"
                        >
                            Confirm password
                        </label>

                        <input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            placeholder="Re-enter your password"
                            autoComplete="new-password"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />

                        {fieldErrors.confirmPassword && (
                            <p className="text-sm text-red-600" role="alert">
                                {fieldErrors.confirmPassword}
                            </p>
                        )}

                        {error && (
                            <p
                                role="alert"
                                className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                            >
                                {error}
                            </p>
                        )}

                        {success && (
                            <p
                                role="status"
                                className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800"
                            >
                                {success}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 flex w-full items-center justify-center rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Creating account..." : "Create account"}
                        </button>
                    </form>

                    <div className="my-6 border-t border-slate-100"/>

                    <p className="text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-blue-700 transition hover:text-blue-800 hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>

                <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 text-center">
                    <p className="text-xs text-slate-500">
                        Product Management System · Secure Access
                    </p>
                </div>
            </section>
        </main>
    );

}

export default Signup;
