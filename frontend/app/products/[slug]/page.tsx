import { API_BASE } from "@/lib/api";
import { notFound } from "next/navigation";

export default async function ProductDetailPage(props: any) {
    // 🔥 FIX LỖI: params là Promise → phải await
    const { slug } = await props.params;

    const res = await fetch(`${API_BASE}/api/products/${slug}`, {
        cache: "no-store",
    });

    if (!res.ok) return notFound();

    const p = await res.json();

    return (
        <div className="w-full bg-gray-50 py-10">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* IMAGE */}
                <div>
                    <div className="border rounded-xl overflow-hidden shadow-sm bg-white">
                        <img src={p.thumbnailUrl} className="w-full object-cover" />
                    </div>

                    <div className="grid grid-cols-5 gap-3 mt-4">
                        {p.images?.map((img: any) => (
                            <div key={img.id} className="border rounded-md overflow-hidden">
                                <img src={img.url} className="w-full h-20 object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* INFO */}
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold">{p.name}</h1>

                    <div className="inline-block px-3 py-1 bg-gray-200 rounded-full text-sm">
                        Thương hiệu: <b>{p.brandName}</b>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-xl font-semibold">Các phiên bản</h2>

                        {p.variants?.map((v: any) => (
                            <div key={v.id} className="border rounded-lg bg-white p-4 shadow-sm">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="font-medium">Mã SKU:</div>
                                    <div>{v.sku}</div>

                                    <div className="font-medium">Kích thước:</div>
                                    <div>{v.sizeText}</div>

                                    <div className="font-medium">Giá:</div>
                                    <div className="text-blue-600 font-bold">
                                        {v.price.toLocaleString()}₫
                                    </div>

                                    <div className="font-medium">Tồn kho:</div>
                                    <div>{v.stockQty}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t">
                        <h2 className="text-xl font-semibold mb-2">Mô tả sản phẩm</h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {p.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
