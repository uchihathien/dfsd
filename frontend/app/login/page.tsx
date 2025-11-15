"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GoogleButton from "@/components/GoogleButton";
import FacebookButton from "@/components/FacebookButton";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const next = searchParams.get("next") || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setError(null);
        setLoading(true);

        try {
            const res = await fetch("/bff/auth/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            // Nếu login thất bại
            if (!res.ok) {
                let message = "";
                try {
                    message = await res.text();
                } catch (_) {}

                setError(message || "Đăng nhập thất bại");
                return;
            }

            // Login thành công
            router.push(next);
            router.refresh();

        } catch (err: any) {
            setError(err?.message || "Lỗi kết nối server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded shadow p-6 mt-8">
            <h1 className="text-xl font-semibold mb-5 text-center">
                Đăng nhập tài khoản
            </h1>

            <form onSubmit={onSubmit} className="space-y-4">

                {/* EMAIL */}
                <div>
                    <label className="text-sm font-medium">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 w-full border rounded px-3 py-2 text-sm"
                        autoComplete="email"
                        required
                    />
                </div>

                {/* PASSWORD */}
                <div>
                    <label className="text-sm font-medium">Mật khẩu</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 w-full border rounded px-3 py-2 text-sm"
                        autoComplete="current-password"
                        required
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-600 whitespace-pre-wrap">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white rounded py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
                >
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
            </form>

            {/* Separator */}
            <div className="my-5 h-px bg-gray-200" />

            <div className="space-y-2">
                <GoogleButton />
                <FacebookButton />
            </div>

            <p className="mt-4 text-sm text-center">
                Chưa có tài khoản?{" "}
                <Link
                    href="/register"
                    className="text-blue-600 hover:underline font-medium"
                >
                    Đăng ký
                </Link>
            </p>
        </div>
    );
}
