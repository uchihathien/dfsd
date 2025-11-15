"use client";

import { useState } from "react";

export function AddToCartButton({
                                    variantId,
                                    disabled,
                                }: {
    variantId: number;
    disabled?: boolean;
}) {
    const [loading, setLoading] = useState(false);

    async function onAdd() {
        try {
            setLoading(true);
            const res = await fetch("/bff/cart/items", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ variantId, quantity: 1 }),
                credentials: "include",                // 👈 để trình duyệt gửi cookie & nhận set-cookie

            });
            if (!res.ok) {
                const t = await res.text();
                throw new Error(t || `Add to cart failed: ${res.status}`);
            }
            // đơn giản: thông báo nhỏ
            alert("Đã thêm vào giỏ!");
        } catch (e: any) {
            alert(e?.message ?? "Lỗi không xác định");
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={onAdd}
            disabled={disabled || loading}
            className="border px-3 py-1 rounded text-sm"
        >
            {loading ? "Đang thêm..." : disabled ? "Hết hàng" : "Thêm vào giỏ"}
        </button>
    );
}
