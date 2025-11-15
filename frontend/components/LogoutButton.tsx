"use client";

import { useQueryClient } from "@tanstack/react-query";

export default function LogoutButton() {
    const qc = useQueryClient();

    const doLogout = async () => {
        await fetch("/bff/auth/logout", {
            method: "POST",
            credentials: "include",
        });

        // Cập nhật header ngay lập tức
        qc.invalidateQueries({ queryKey: ["me"] });
    };

    return (
        <button
            onClick={doLogout}
            className="text-red-600 text-sm hover:underline"
        >
            Đăng xuất
        </button>
    );
}
