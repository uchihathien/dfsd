// frontend/components/FacebookButton.tsx
"use client";
import { useEffect } from "react";

declare global { interface Window { fbAsyncInit: any; FB: any; } }

export default function FacebookButton() {
    useEffect(() => {
        window.fbAsyncInit = function() {
            window.FB.init({
                appId: process.env.NEXT_PUBLIC_FB_APP_ID,
                cookie: true,
                xfbml: false,
                version: "v18.0",
            });
        };
        const s = document.createElement("script");
        s.src = "https://connect.facebook.net/en_US/sdk.js";
        s.async = true; document.body.appendChild(s);
    }, []);

    const login = () => {
        window.FB.login(async (response:any) => {
            if (response.authResponse) {
                const accessToken = response.authResponse.accessToken;
                const r = await fetch("/bff/auth/oauth/facebook", {
                    method: "POST",
                    headers: {"Content-Type":"application/json"},
                    body: JSON.stringify({ accessToken })
                });
                if (r.ok) window.location.href = "/";
                else alert("Facebook login failed");
            }
        }, { scope: "email" });
    };

    return <button onClick={login} className="border px-4 py-2">Đăng nhập Facebook</button>;
}
