"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBox({ defaultValue = "" }) {
    const router = useRouter();
    const [q, setQ] = useState(defaultValue);

    const submit = () => {
        router.push(`/products?q=${q}`);
    };

    return (
        <div className="flex gap-2 mb-5">
            <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm sản phẩm..."
                className="border p-2 rounded w-full"
            />
            <button onClick={submit} className="bg-blue-600 text-white px-4 rounded">
                Tìm
            </button>
        </div>
    );
}
