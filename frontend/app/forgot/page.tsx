"use client";
import { useState } from "react";

export default function ForgotPage() {
    const [email,setEmail] = useState(""); const [sent,setSent] = useState(false);
    const submit = async (e:any) => {
        e.preventDefault();
        await fetch(`${process.env.BACKEND_URL}/api/auth/forgot`, {
            method:"POST", headers:{"Content-Type":"application/json"},
            body: JSON.stringify({ email, resetBaseUrl: "http://localhost:3000/reset" })
        });
        setSent(true);
    };
    return (
        <main className="max-w-md mx-auto p-4">
            <h1 className="text-xl font-semibold mb-3">Quên mật khẩu</h1>
            {sent ? <div>Vui lòng kiểm tra email để đặt lại mật khẩu.</div> : (
                <form onSubmit={submit} className="space-y-3">
                    <input className="border p-2 w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
                    <button className="bg-black text-white px-4 py-2">Gửi liên kết</button>
                </form>
            )}
        </main>
    );
}
