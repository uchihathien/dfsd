"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OAuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        // Sau khi backend set cookie JWT, chỉ cần quay lại home (hoặc /cart)
        router.replace("/");
        router.refresh();
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-lg">Đang hoàn tất đăng nhập...</p>
        </div>
    );
}
