import axios from "axios";

export function getApiErrorMessage(
    error: unknown,
    fallbackMessage: string
): string {
    if (!axios.isAxiosError(error)) {
        return "Something went wrong. Please try again.";
    }

    if (!error.response) {
        return "Unable to connect to the server. Please check your internet connection and try again.";
    }

    const status = error.response.status;
    const data: unknown = error.response.data;

    if (typeof data === "string" && data.trim()) {
        return data;
    }

    if (
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof data.message === "string" &&
        data.message.trim()
    ) {
        return data.message;
    }

    if (status >= 500) {
        return "A server error occurred. Please try again later.";
    }

    return fallbackMessage;
}
