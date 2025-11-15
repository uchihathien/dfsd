"use client";

import Link from "next/link";
import { useTransition, useState } from "react";

type Me = {
    id: number;
    email: string;
    fullName?: string;
    role?: string;
} | null;

export default function AuthStatus({ me }: { me: Me }) {
    const [pending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleLogout = () => {
        startTransition(async () => {
            setError(null);
            const res = await fetch("/bff/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            if (!res.ok) {
                setError("Đăng xuất thất bại");
                return;
            }
            window.location.href = "/";
        });
    };

    if (!me) {
        return (
            <div className="flex items-center gap-2 text-sm">
                <Link href="/login" className="hover:underline">
                    Đăng nhập
                </Link>
                <span className="text-gray-400">/</span>
                <Link href="/register" className="hover:underline">
                    Đăng ký
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-end gap-1 text-sm">
            <div>
                Xin chào, <span className="font-medium">{me.fullName ?? me.email}</span>
            </div>
            <button
                onClick={handleLogout}
                disabled={pending}
                className="text-xs text-red-600 hover:underline disabled:opacity-60"
            >
                {pending ? "Đang đăng xuất..." : "Đăng xuất"}
            </button>
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}
