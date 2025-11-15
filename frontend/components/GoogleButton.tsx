"use client";

import Script from "next/script";
import { useCallback, useEffect, useState } from "react";

export default function GoogleButton() {
    const [sdkReady, setSdkReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    // callback khi Google trả về credential (id_token)
    const handleCredentialResponse = useCallback(async (response: any) => {
        const idToken = response?.credential as string | undefined;
        if (!idToken) {
            setError("Không lấy được id_token từ Google");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/bff/auth/oauth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ idToken }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setError((data && (data.error as string)) || "Đăng nhập Google thất bại");
                return;
            }

            // Đăng nhập thành công – redirect tuỳ bạn
            window.location.href = "/";
        } catch (e: any) {
            setError(e?.message || "Có lỗi kết nối đến server");
        } finally {
            setLoading(false);
        }
    }, []);

    // Khi SDK load xong -> init Google + render nút
    useEffect(() => {
        if (!sdkReady) return;
        if (typeof window === "undefined") return;

        const google = (window as any).google;
        if (!google) return;

        if (!clientId) {
            setError("Thiếu NEXT_PUBLIC_GOOGLE_CLIENT_ID");
            return;
        }

        try {
            google.accounts.id.initialize({
                client_id: clientId,
                callback: handleCredentialResponse,
            });

            const container = document.getElementById(
                "google-signin-btn"
            ) as HTMLElement | null;

            if (!container) {
                console.warn("Không tìm thấy #google-signin-btn để render nút Google");
                return;
            }

            // ép kiểu as any để tránh lỗi TS về option 'type', 'text'...
            google.accounts.id.renderButton(
                container,
                {
                    type: "standard",
                    theme: "outline",
                    size: "large",
                    text: "continue_with",
                    shape: "rectangular",
                    width: 320,
                } as any
            );
        } catch (err) {
            console.error("Google init error:", err);
            setError("Không khởi tạo được nút Google");
        }
    }, [sdkReady, clientId, handleCredentialResponse]);

    return (
        <>
            {/* SDK Google Identity Services – dùng được cho Next 15/16 */}
            <Script
                src="https://accounts.google.com/gsi/client"
                async
                defer
                onLoad={() => setSdkReady(true)}
                onError={() => setError("Không tải được SDK Google")}
            />

            <div className="space-y-2">
                {/* Container để Google render nút */}
                <div id="google-signin-btn" className="flex justify-center" />

                {loading && (
                    <p className="text-xs text-gray-500 text-center">
                        Đang đăng nhập với Google...
                    </p>
                )}
                {error && (
                    <p className="text-xs text-red-600 text-center whitespace-pre-line">
                        {error}
                    </p>
                )}
            </div>
        </>
    );
}
