"use client";

import { useState, FormEvent } from "react";

export default function AddToCartButton({ variantId }: { variantId: number }) {
    const [loading, setLoading] = useState(false);
    const [ok, setOk] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const handleAdd = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErr(null);
        setOk(false);
        try {
            const res = await fetch("/bff/cart/items", {
                method: "POST",
                headers: { "content-type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ variantId, quantity: 1 }),
            });
            if (!res.ok) {
                const msg = await res.text().catch(() => "");
                setErr(msg || "Thêm vào giỏ thất bại");
            } else {
                setOk(true);
            }
        } catch (e: any) {
            setErr(e.message || "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-1">
            <button
                onClick={handleAdd}
                disabled={loading}
                className="bg-blue-600 text-white rounded px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
            >
                {loading ? "Đang thêm..." : "Thêm vào giỏ"}
            </button>
            {ok && <p className="text-xs text-green-600">Đã thêm vào giỏ</p>}
            {err && <p className="text-xs text-red-600">{err}</p>}
        </div>
    );
}
