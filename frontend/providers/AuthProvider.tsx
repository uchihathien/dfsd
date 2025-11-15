"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = {
    email: string;
    fullName: string;
    role: string;
};

type AuthContextType = {
    user: User | null;
    setUser: (u: User | null) => void;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // load profile khi reload trang
    useEffect(() => {
        fetch("/bff/auth/me", { credentials: "include" })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                setUser(data);
                setLoading(false);
            })
            .catch(() => {
                setUser(null);
                setLoading(false);
            });
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
