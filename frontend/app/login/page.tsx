"use client";

import { useState } from "react";
import Link from "next/link";
import GoogleButton from "@/components/GoogleButton";
import FacebookButton from "@/components/FacebookButton";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr("");

        if (!email || !password) {
            setErr("Vui lòng nhập đầy đủ email và mật khẩu");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/bff/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            setLoading(false);

            if (res.ok) {
                await res.text();
                window.location.href = "/?login=ok";
            } else {
                setErr("Email hoặc mật khẩu không đúng");
            }
        } catch (error) {
            console.error(error);
            setErr("Lỗi kết nối. Vui lòng thử lại sau.");
            setLoading(false);
        }
    };

    const inputBox = (children: React.ReactNode) => (
        <div className="bg-gray-50 border rounded-xl px-4 py-3 flex items-center gap-3 focus-within:ring-2 focus-within:ring-black/30 transition">
            {children}
        </div>
    );

    return (
        <main className="flex justify-center items-center min-h-screen px-4 bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-10 border border-gray-100">

                {/* TITLE */}
                <h1 className="text-3xl font-bold text-center mb-3 tracking-tight">
                    Chào mừng trở lại
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Đăng nhập để tiếp tục mua sắm nhanh chóng và tiện lợi.
                </p>

                {/* FORM */}
                <form onSubmit={onSubmit} className="space-y-6">

                    {/* EMAIL */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>

                        {inputBox(
                            <>
                                <Mail size={20} className="text-gray-500" />
                                <input
                                    type="email"
                                    className="flex-1 bg-transparent outline-none text-gray-700"
                                    placeholder="email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </>
                        )}
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Mật khẩu</label>

                        {inputBox(
                            <>
                                <Lock size={20} className="text-gray-500" />

                                <input
                                    type={showPwd ? "text" : "password"}
                                    className="flex-1 bg-transparent outline-none text-gray-700"
                                    placeholder="Nhập mật khẩu"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPwd(!showPwd)}
                                    className="text-gray-500"
                                >
                                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </>
                        )}
                    </div>

                    {/* ERROR */}
                    {err && <p className="text-red-600 text-sm text-center">{err}</p>}

                    {/* BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl text-white font-medium text-lg
                                   bg-gradient-to-r from-black to-gray-700
                                   hover:opacity-90 transition flex items-center justify-center gap-2
                                   disabled:bg-gray-400"
                    >
                        {loading && <Loader2 className="animate-spin" size={18} />}
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </form>

                {/* FORGOT PASSWORD */}
                <div className="text-center mt-4">
                    <Link
                        href="/forgot"
                        className="text-sm text-gray-700 hover:underline"
                    >
                        Quên mật khẩu?
                    </Link>
                </div>

                {/* OR DIVIDER */}
                <div className="my-7 flex items-center gap-3">
                    <hr className="flex-1 border-gray-300" />
                    <span className="text-gray-500 text-sm">Hoặc</span>
                    <hr className="flex-1 border-gray-300" />
                </div>

                {/* SOCIAL LOGIN */}
                <div className="space-y-3">
                    <GoogleButton />
                    <FacebookButton />
                </div>

                {/* LINK TO REGISTER */}
                <p className="text-sm text-center mt-6 text-gray-600">
                    Chưa có tài khoản?{" "}
                    <Link href="/register" className="text-black font-semibold hover:underline">
                        Đăng ký ngay
                    </Link>
                </p>
            </div>
        </main>
    );
}
