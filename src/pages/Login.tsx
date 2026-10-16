import {useState, type FormEvent} from "react";
import {Link, Navigate, useNavigate} from "react-router-dom";
import {loginUser} from "../services/authService";
import {useAuth} from "../context/AuthContext";
import {getApiErrorMessage} from "../utils/apiError";
import {validateEmail, validatePassword} from "../utils/validation";

function createCaptcha() {
    return {
        first: Math.floor(Math.random() * 9) + 1,
        second: Math.floor(Math.random() * 9) + 1,
    };
}

function Login() {
    const navigate = useNavigate();
    const {login, token, isInitializing} = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [fieldErrors, setFieldErrors] = useState({
        email: "",
        password: "",
    });

    const [captchaNumbers, setCaptchaNumbers] = useState(createCaptcha);
    const [captchaAnswer, setCaptchaAnswer] = useState("");
    const [captchaError, setCaptchaError] = useState("");

    if (isInitializing) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-gray-600">Restoring session...</p>
            </div>
        );
    }

    if (token) {
        return <Navigate to="/dashboard" replace/>;
    }

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        setError("");
        setCaptchaError("");

        const errors = {
            email: validateEmail(email),
            password: validatePassword(password),
        };

        setFieldErrors(errors);

        if (Object.values(errors).some(Boolean)) {
            return;
        }

        if (
            captchaAnswer.trim() === "" ||
            Number(captchaAnswer) !==
            captchaNumbers.first + captchaNumbers.second
        ) {
            setCaptchaError("Incorrect answer. Please try again.");
            setCaptchaNumbers(createCaptcha());
            setCaptchaAnswer("");
            return;
        }

        setLoading(true);

        try {
            const data = await loginUser({
                email: email.trim(),
                password,
            });

            login(data.token);
            navigate("/dashboard", {replace: true});
        } catch (err: unknown) {
            setError(
                getApiErrorMessage(
                    err,
                    "Login failed. Please check your email and password."
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
                    <div className="mb-8 flex items-center gap-3">
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

                    <div className="mb-7">
                        <h1 className="text-2xl font-bold text-slate-900">
                            Welcome back
                        </h1>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Sign in to manage your products and categories.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-2"
                    >
                        <label
                            htmlFor="email"
                            className="text-sm font-semibold text-slate-700"
                        >
                            Email address
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="name@company.com"
                            autoComplete="email"
                            className="mb-3 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />

                        {fieldErrors.email && (
                            <p className="-mt-3 mb-2 text-sm text-red-600" role="alert">
                                {fieldErrors.email}
                            </p>
                        )}

                        <label
                            htmlFor="password"
                            className="text-sm font-semibold text-slate-700"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />

                        {fieldErrors.password && (
                            <p className="text-sm text-red-600" role="alert">
                                {fieldErrors.password}
                            </p>
                        )}

                        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                            <label
                                htmlFor="captcha"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Security verification
                            </label>

                            <div className="mb-3 flex items-center justify-between">
                                <span className="text-sm text-slate-500">
                                    Solve the following to continue
                                </span>
                                <span
                                    className="rounded-md border border-slate-200 bg-white px-3 py-1.5 font-semibold tracking-wider text-slate-800">
                                    {captchaNumbers.first} + {captchaNumbers.second} = ?
                                </span>
                            </div>

                            <input
                                id="captcha"
                                type="number"
                                value={captchaAnswer}
                                onChange={(event) => {
                                    setCaptchaAnswer(event.target.value);
                                    setCaptchaError("");
                                }}
                                placeholder="Enter your answer"
                                required
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            />

                            {captchaError && (
                                <p className="mt-2 text-sm text-red-600" role="alert">
                                    {captchaError}
                                </p>
                            )}
                        </div>

                        {error && (
                            <p
                                role="alert"
                                className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                            >
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 flex w-full items-center justify-center rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Signing in..." : "Sign in to dashboard"}
                        </button>
                    </form>

                    <div className="my-6 border-t border-slate-100"/>

                    <p className="text-center text-sm text-slate-500">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="font-semibold text-blue-700 hover:text-blue-800 hover:underline"
                        >
                            Create account
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

export default Login;
