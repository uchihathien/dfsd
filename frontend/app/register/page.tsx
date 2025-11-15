"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        if (password !== confirm) {
            setError("Mật khẩu nhập lại không khớp");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/bff/auth/register", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ email, password, fullName }),
            });
            if (!res.ok) {
                const msg = await res.text().catch(() => "");
                setError(msg || "Đăng ký thất bại");
            } else {
                // sau đăng ký chuyển sang login
                router.push("/login");
            }
        } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded shadow p-6 mt-6">
            <h1 className="text-xl font-semibold mb-4">Đăng ký</h1>

            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="text-sm font-medium">Họ tên</label>
                    <input
                        className="mt-1 w-full border rounded px-3 py-2 text-sm"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="text-sm font-medium">Email</label>
                    <input
                        type="email"
                        className="mt-1 w-full border rounded px-3 py-2 text-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="text-sm font-medium">Mật khẩu</label>
                    <input
                        type="password"
                        className="mt-1 w-full border rounded px-3 py-2 text-sm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="text-sm font-medium">Nhập lại mật khẩu</label>
                    <input
                        type="password"
                        className="mt-1 w-full border rounded px-3 py-2 text-sm"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white rounded py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
                >
                    {loading ? "Đang đăng ký..." : "Đăng ký"}
                </button>
            </form>

            <p className="mt-4 text-sm text-center">
                Đã có tài khoản?{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                    Đăng nhập
                </Link>
            </p>
        </div>
    );
}
