"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, Mail, Lock, User } from "lucide-react";
import Link from "next/link";

const strongPassword = (pwd: string) => {
    const errors: string[] = [];
    if (!pwd || pwd.length < 8) errors.push("Tối thiểu 8 ký tự");
    if (!/[A-Z]/.test(pwd)) errors.push("Ít nhất 1 chữ HOA");
    if (!/[a-z]/.test(pwd)) errors.push("Ít nhất 1 chữ thường");
    if (!/[0-9]/.test(pwd)) errors.push("Ít nhất 1 chữ số");
    if (!/[^A-Za-z0-9]/.test(pwd)) errors.push("Ít nhất 1 ký tự đặc biệt");
    return errors;
};

const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
};

export default function RegisterPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [emailTaken, setEmailTaken] = useState<boolean | null>(null);

    const [pwErrors, setPwErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const [showPwd, setShowPwd] = useState(false);
    const [showConfirmPwd, setShowConfirmPwd] = useState(false);

    const strength = getPasswordStrength(password);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (email) checkEmail();
        }, 500);
        return () => clearTimeout(timer);
    }, [email]);

    const checkEmail = async () => {
        const r = await fetch(`/bff/auth/check-email?email=${encodeURIComponent(email)}`);
        if (r.ok) {
            const d = await r.json();
            setEmailTaken(d.exists);
        }
    };

    useEffect(() => {
        setPwErrors(strongPassword(password));
    }, [password]);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr("");

        if (!fullName || !email || !password || !confirm) {
            setErr("Vui lòng điền đầy đủ thông tin");
            return;
        }

        if (emailTaken) {
            setErr("Email đã được đăng ký");
            return;
        }

        if (password !== confirm) {
            setErr("Mật khẩu nhập lại không khớp");
            return;
        }

        if (pwErrors.length > 0) {
            setErr("Mật khẩu chưa đủ mạnh");
            return;
        }

        setLoading(true);

        const r = await fetch("/bff/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullName, email, password })
        });

        setLoading(false);

        if (r.ok) {
            window.location.href = "/login?registered=1";
        } else {
            const data = await r.json().catch(() => ({}));
            setErr(data?.message || "Đăng ký thất bại");
        }
    };

    const inputBox = (children: React.ReactNode) => (
        <div className="bg-gray-50 border rounded-xl px-4 py-3 flex items-center gap-3 focus-within:ring-2 focus-within:ring-black/30 transition">
            {children}
        </div>
    );

    return (
        <main className="flex justify-center items-center bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen px-4">
            <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-10 border border-gray-100">

                <h1 className="text-3xl font-bold text-center mb-4 tracking-tight">
                    Tạo tài khoản mới
                </h1>

                <p className="text-center text-gray-600 mb-8">
                    Trải nghiệm mua sắm cao cấp – nhanh chóng – tiện lợi.
                </p>

                <form onSubmit={submit} className="space-y-6">

                    {/* FULL NAME */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Họ và tên</label>

                        {inputBox(
                            <>
                                <User size={20} className="text-gray-500" />
                                <input
                                    className="bg-transparent flex-1 outline-none text-gray-700"
                                    placeholder="Nguyễn Văn A"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </>
                        )}
                    </div>

                    {/* EMAIL */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>

                        {inputBox(
                            <>
                                <Mail size={20} className="text-gray-500" />
                                <input
                                    type="email"
                                    className="bg-transparent flex-1 outline-none text-gray-700"
                                    placeholder="email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </>
                        )}

                        {emailTaken === true && (
                            <p className="text-red-600 text-sm mt-1">Email đã được đăng ký</p>
                        )}
                        {emailTaken === false && email && (
                            <p className="text-green-600 text-sm mt-1">Email hợp lệ ✔</p>
                        )}
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Mật khẩu</label>

                        <div className="relative">
                            {inputBox(
                                <>
                                    <Lock size={20} className="text-gray-500" />
                                    <input
                                        type={showPwd ? "text" : "password"}
                                        className="bg-transparent flex-1 outline-none text-gray-700"
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

                        {/* Strength Indicator */}
                        <div className="mt-2 flex gap-2">
                            {[1, 2, 3, 4].map(i => (
                                <div
                                    key={i}
                                    className={`h-1 flex-1 rounded transition ${
                                        strength >= i
                                            ? "bg-green-500"
                                            : "bg-gray-300"
                                    }`}
                                ></div>
                            ))}
                        </div>

                        {pwErrors.length > 0 && (
                            <ul className="text-xs text-orange-600 mt-2 list-disc pl-5">
                                {pwErrors.map(err => <li key={err}>{err}</li>)}
                            </ul>
                        )}
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Nhập lại mật khẩu</label>

                        <div className="relative">
                            {inputBox(
                                <>
                                    <Lock size={20} className="text-gray-500" />

                                    <input
                                        type={showConfirmPwd ? "text" : "password"}
                                        className="bg-transparent flex-1 outline-none text-gray-700"
                                        placeholder="Xác nhận mật khẩu"
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                                        className="text-gray-500"
                                    >
                                        {showConfirmPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </>
                            )}
                        </div>

                        {confirm && password !== confirm && (
                            <p className="text-red-600 text-sm mt-1">Mật khẩu không khớp</p>
                        )}
                    </div>

                    {/* ERROR */}
                    {err && <p className="text-red-600 text-center text-sm">{err}</p>}

                    {/* BUTTON */}
                    <button
                        disabled={loading}
                        className="w-full py-3 rounded-xl text-white font-medium text-lg
                                   bg-gradient-to-r from-black to-gray-700
                                   hover:opacity-90 transition flex items-center justify-center gap-2
                                   disabled:bg-gray-400"
                    >
                        {loading && <Loader2 className="animate-spin" size={20} />}
                        {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
                    </button>
                </form>

                {/* LOGIN LINK */}
                <p className="text-sm text-center mt-6 text-gray-600">
                    Đã có tài khoản?{" "}
                    <Link href="/login" className="text-black font-semibold hover:underline">
                        Đăng nhập ngay
                    </Link>
                </p>
            </div>
        </main>
    );
}
