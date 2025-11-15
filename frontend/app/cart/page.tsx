import { headers } from "next/headers";
import Link from "next/link";

type CartItemDto = {
    id: number;
    variantId: number;
    sku: string;
    productName: string;
    thumbnailUrl: string | null;
    price: number;
    quantity: number;
    stockQty: number;
};

type CartDto = {
    id: string;
    items: CartItemDto[];
    subtotal: number;
    totalQty: number;
};

export const dynamic = "force-dynamic";

export default async function CartPage() {
    const h = await headers();
    const proto = h.get("x-forwarded-proto") ?? "http";
    const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
    const origin = `${proto}://${host}`;

    const res = await fetch(`${origin}/bff/cart`, {
        headers: {
            cookie: h.get("cookie") ?? "",
        },
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
            <h1 className="text-2xl font-semibold">Giỏ hàng</h1>

            {!hasItems ? (
                <div className="border rounded p-6 bg-white">
                    <p>Giỏ hàng đang trống.</p>
                    <Link href="/products" className="text-blue-600 hover:underline">
                        Tiếp tục mua sắm
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Danh sách sản phẩm */}
                    <div className="lg:col-span-2 bg-white border rounded divide-y">
                        {cart.items.map((item) => (
                            <div
                                key={item.id}
                                className="p-3 flex items-center gap-4 justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    {item.thumbnailUrl && (
                                        <img
                                            src={item.thumbnailUrl}
                                            alt={item.productName}
                                            className="w-16 h-16 object-cover rounded border"
                                        />
                                    )}
                                    <div>
                                        <div className="font-medium">{item.productName}</div>
                                        <div className="text-xs text-gray-500">
                                            SKU: {item.sku}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Còn lại trong kho: {item.stockQty}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end text-sm gap-1">
                                    <div className="text-gray-700">
                                        Đơn giá:{" "}
                                        <span className="font-medium">
                      {item.price.toLocaleString("vi-VN")} ₫
                    </span>
                                    </div>
                                    <div>Số lượng: {item.quantity}</div>
                                    <div className="font-semibold">
                                        {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tóm tắt đơn hàng */}
                    <div className="bg-white border rounded p-4 space-y-3 h-fit">
                        <div className="flex justify-between text-sm">
                            <span>Tổng số lượng</span>
                            <span className="font-semibold">{cart.totalQty}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Tạm tính</span>
                            <span className="font-semibold">
                {cart.subtotal.toLocaleString("vi-VN")} ₫
              </span>
                        </div>
                        <button className="w-full bg-green-600 text-white rounded py-2 text-sm font-medium hover:bg-green-700">
                            Thanh toán
                        </button>
                        <Link
                            href="/products"
                            className="block text-center text-sm text-blue-600 hover:underline"
                        >
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
