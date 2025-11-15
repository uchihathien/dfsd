import { headers } from "next/headers";
import Link from "next/link";

type CartItem = {
    id: number;
    productName: string;
    sku: string;
    quantity: number;
    price: number;
    subtotal: number;
};

type CartDto = {
    id: string;
    items: CartItem[];
    subtotal: number;
    totalQty: number;
};

export const dynamic = "force-dynamic";

export default async function CartPage() {
    const h = headers();
    const proto = h.get("x-forwarded-proto") ?? "http";
    const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
    const origin = `${proto}://${host}`;

    const res = await fetch(`${origin}/bff/cart`, {
        headers: { cookie: h.get("cookie") ?? "" },
        cache: "no-store",
    });

    if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `Load cart failed: ${res.status}`);
    }

    const cart = (await res.json()) as CartDto;

    const hasItems = cart.items && cart.items.length > 0;

    return (
        <div className="space-y-4">
        <h1 className="text-2xl font-semibold mb-2">Giỏ hàng</h1>

    {!hasItems ? (
        <div className="border rounded p-6 bg-white">
            <p>Giỏ hàng đang trống.</p>
    <Link href="/products" className="text-blue-600 hover:underline">
        Tiếp tục mua sắm
    </Link>
    </div>
    ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border rounded divide-y">
            {cart.items.map((item) => (
                    <div
                        key={item.id}
                className="p-3 flex items-center justify-between gap-4"
                >
                <div>
                    <div className="font-medium">{item.productName}</div>
                    <div className="text-xs text-gray-500">SKU: {item.sku}</div>
    </div>
    <div className="flex items-center gap-4 text-sm">
        <div>{item.price.toLocaleString("vi-VN")} ₫</div>
    <div>SL: {item.quantity}</div>
    <div className="font-semibold">
        {item.subtotal.toLocaleString("vi-VN")} ₫
    </div>
    </div>
    </div>
    ))}
        </div>

        <div className="bg-white border rounded p-4 h-fit space-y-3">
    <div className="flex justify-between">
        <span>Tổng số lượng</span>
    <span className="font-semibold">{cart.totalQty}</span>
        </div>
        <div className="flex justify-between">
        <span>Tạm tính</span>
    <span className="font-semibold">
        {cart.subtotal.toLocaleString("vi-VN")} ₫
    </span>
    </div>
    <button className="w-full bg-green-600 text-white rounded py-2 text-sm font-medium hover:bg-green-700">
        Thanh toán
    </button>
    </div>
    </div>
    )}
    </div>
);
}
