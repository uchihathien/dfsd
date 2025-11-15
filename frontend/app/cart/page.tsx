// frontend/app/cart/page.tsx
import { headers } from "next/headers";
import Link from "next/link";

type CartItem = {
    id: number;
    variantId: number;
    sku: string;
    productName: string;
    price: number;
    quantity: number;
    stockQty: number;
};
type CartDto = {
    id: string;
    items: CartItem[];
    subtotal: number;
    totalQty: number;
};

export const dynamic = "force-dynamic";

export default async function CartPage() {
    const h = await headers();
    // 🔸 Lấy origin tuyệt đối từ request: http(s)://host
    const proto = h.get("x-forwarded-proto") ?? "http";
    const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
    const origin = `${proto}://${host}`;

    // 🔸 Forward cookie của người dùng sang BFF
    const cookieHeader = h.get("cookie") ?? "";

    const res = await fetch(`${origin}/bff/cart`, {
        headers: { cookie: cookieHeader, accept: "application/json" },
        cache: "no-store",
    });

    if (!res.ok) {
        // 401 khi giỏ theo user mà chưa đăng nhập
        if (res.status === 401) {
            return (
                <div className="mx-auto max-w-5xl p-6">
                    <div className="border rounded p-6">
                        Vui lòng <Link className="underline" href="/login?next=/cart">đăng nhập</Link> để xem giỏ hàng.
                    </div>
                </div>
            );
        }
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `Load cart failed: ${res.status}`);
    }

    const cart = (await res.json()) as CartDto;

    return (
        <div className="mx-auto max-w-6xl p-4 md:p-6">
            <h1 className="text-2xl font-semibold mb-4">Giỏ hàng</h1>

            {(!cart.items || cart.items.length === 0) ? (
                <div className="border rounded p-6">
                    Giỏ hàng trống. <Link className="underline" href="/products">Tiếp tục mua sắm</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-3">
                        {cart.items.map((it) => (
                            <div key={it.id} className="border rounded p-3 flex items-center justify-between gap-3">
                                <div>
                                    <div className="font-medium">{it.productName}</div>
                                    <div className="text-sm text-gray-500">SKU: {it.sku}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-24 text-right">{it.price.toLocaleString("vi-VN")} ₫</div>
                                    <div className="text-sm">SL: {it.quantity}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border rounded p-4 h-fit">
                        <div className="flex justify-between">
                            <span>Tạm tính</span>
                            <b>{(cart.subtotal ?? 0).toLocaleString("vi-VN")} ₫</b>
                        </div>
                        <Link href="/checkout" className="mt-4 block text-center border rounded px-3 py-2 hover:bg-gray-100">
                            Tiếp tục thanh toán
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
