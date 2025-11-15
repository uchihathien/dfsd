"use client";
import { useState } from "react";

export default function ResetPage({ params }:{ params:{ token:string }}) {
    const [pwd,setPwd] = useState(""); const [ok,setOk] = useState(false);
    const submit = async (e:any) => {
        e.preventDefault();
        const r = await fetch(`${process.env.BACKEND_URL}/api/auth/reset`, {
            method:"POST", headers:{"Content-Type":"application/json"},
            body: JSON.stringify({ token: params.token, newPassword: pwd })
        });
        setOk(r.ok);
    };
    return (
        <main className="max-w-md mx-auto p-4">
            <h1 className="text-xl font-semibold mb-3">Đặt lại mật khẩu</h1>
            {ok ? <div>Thành công. <a className="underline" href="/login">Đăng nhập</a></div> : (
                <form onSubmit={submit} className="space-y-3">
                    <input className="border p-2 w-full" placeholder="Mật khẩu mới" type="password" value={pwd} onChange={e=>setPwd(e.target.value)} />
                    <button className="bg-black text-white px-4 py-2">Đổi mật khẩu</button>
                </form>
            )}
        </main>
    );
}
