import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode
} from "react";
import { setAccessToken } from "../api/tokenStore";
import { refreshAccessToken } from "../services/authService";

interface AuthContextType {
    token: string | null;
    isInitializing: boolean;
    login: (accessToken: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [token, setToken] = useState<string | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const restoreSession = async () => {
            try {
                const newToken = await refreshAccessToken();

                if (isMounted) {
                    setAccessToken(newToken);
                    setToken(newToken);
                }
            } catch {
                if (isMounted) {
                    setAccessToken(null);
                    setToken(null);
                }
            } finally {
                if (isMounted) {
                    setIsInitializing(false);
                }
            }
        };

        restoreSession();

        return () => {
            isMounted = false;
        };
    }, []);

    const login = (accessToken: string) => {
        setAccessToken(accessToken);
        setToken(accessToken);
    };

    const logout = () => {
        setAccessToken(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{ token, isInitializing, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
