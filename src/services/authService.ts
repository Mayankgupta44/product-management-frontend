import refreshAxios from "../api/refreshAxios";
import axiosInstance from "../api/axiosInstance";
import type {
    LoginRequest,
    LoginResponse,
    SignupRequest,
} from "../types/auth.types";

export const loginUser = async (
    request: LoginRequest
): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>(
        "/auth/login",
        request
    );

    return response.data;
};

export const signupUser = async (
    request: SignupRequest
): Promise<unknown> => {
    const response = await axiosInstance.post(
        "/users",
        request
    );

    return response.data;
};

export const logoutFromServer = async (): Promise<void> => {
    await axiosInstance.post("/auth/logout");
};

let refreshPromise: Promise<string> | null = null;

export const refreshAccessToken = (): Promise<string> => {
    if (!refreshPromise) {
        refreshPromise = refreshAxios
            .post<{ token: string }>("/auth/refresh")
            .then((response) => response.data.token)
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
};