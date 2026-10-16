
import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { getAccessToken, setAccessToken } from "./tokenStore";
import refreshAxios from "./refreshAxios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAccessToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: unknown) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
        if (!axios.isAxiosError(error) || !error.config) {
            return Promise.reject(error);
        }

        const originalRequest = error.config;

        if (
            error.response?.status !== 401 ||
            originalRequest.url?.includes("/auth/login") ||
            originalRequest.url?.includes("/auth/signup") ||
            originalRequest.url?.includes("/auth/refresh") ||
            originalRequest.url?.includes("/auth/logout") ||
            originalRequest.headers["X-Retry"] === "true"
        ) {
            return Promise.reject(error);
        }

        originalRequest.headers["X-Retry"] = "true";

        try {
            const response = await refreshAxios.post<{
                message: string;
                token: string;
            }>("/auth/refresh");

            const newToken = response.data.token;

            setAccessToken(newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            return axiosInstance(originalRequest);
        } catch (refreshError) {
            setAccessToken(null);
            return Promise.reject(refreshError);
        }
    }
);

export default axiosInstance;
