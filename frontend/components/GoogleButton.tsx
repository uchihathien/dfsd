"use client";

import Script from "next/script";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export default function GoogleButton() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const handleCredentialResponse = async (resp: { credential: string }) => {
        const idToken = resp.credential;
        if (!idToken) return alert("No ID token received");

        try {
            const r = await fetch("/bff/auth/oauth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ idToken }),
            });

            if (r.ok) {

                // 🔥 1) Update lại user ngay lập tức
                await queryClient.invalidateQueries({ queryKey: ["me"] });

                // 🔥 2) Điều hướng UI
                router.replace("/");
            } else {
                const data = await r.json();
                alert(data.message || "Google login failed");
            }
        } catch (err) {
            console.error(err);
            alert("Google login error");
        }
    };

    useEffect(() => {
        const initialize = () => {
            if (!window.google) return;

            window.google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
                callback: handleCredentialResponse,
            });

            const btnContainer = document.getElementById("gbtn");
            if (btnContainer) {
                window.google.accounts.id.renderButton(btnContainer, {
                    theme: "outline",
                    size: "large",
                });
            }
        };

        if (typeof window !== "undefined") {
            setTimeout(initialize, 300);
        }
    }, []);

    return (
        <>
            <Script
                src="https://accounts.google.com/gsi/client"
                strategy="afterInteractive"
            />
            <div id="gbtn"></div>
        </>
    );
}
