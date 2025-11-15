// app/products/[slug]/page.tsx
import { apiFetch } from "@/lib/api";
import { ProductDetailDto } from "@/types/catalog";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";

type Params = { slug: string };

export async function generateMetadata({
                                           params,
                                       }: {
    params: Promise<Params>;
}) {
    // Luôn await params trong Next 15/16
    const { slug } = await params;

    // Nếu slug rỗng -> metadata tối thiểu, tránh throw làm vỡ build
    if (!slug) {
        return { title: "Sản phẩm | Cửa hàng cơ khí" };
    }

    // Đừng để throw làm crash metadata
    try {
        const p = await apiFetch<ProductDetailDto>(`/api/products/${encodeURIComponent(slug)}`);
        return {
            title: `${p.name} | Cửa hàng cơ khí`,
            description: p.description?.slice(0, 150) ?? "",
            alternates: { canonical: `/products/${slug}` },
            openGraph: {
                title: p.name,
                description: p.description?.slice(0, 150) ?? "",
                images: p.thumbnailUrl ? [p.thumbnailUrl] : [],
            },
        };
    } catch {
        // Khi không fetch được, trả metadata tối thiểu
        return { title: "Sản phẩm | Cửa hàng cơ khí" };
    }
}

export default async function ProductDetailPage({
                                                    params,
                                                }: {
    params: Promise<Params>;
}) {
    const { slug } = await params;

    if (!slug) {
        notFound();
    }

    try {
        const p = await apiFetch<ProductDetailDto>(
            `/api/products/${encodeURIComponent(slug)}`
        );

        return (
            <div className="mx-auto max-w-6xl p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={p.thumbnailUrl || "https://placehold.co/600x400"}
                            alt={p.name}
                            className="w-full rounded"
                        />
                        <div className="grid grid-cols-4 gap-2 mt-2">
                            {p.images?.map((img) => (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    key={img.id}
                                    src={img.url}
                                    alt=""
                                    className="w-full h-20 object-cover rounded"
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <h1 className="text-2xl font-semibold">{p.name}</h1>
                        {p.brandName && (
                            <div className="text-sm text-gray-500 mt-1">
                                Thương hiệu: {p.brandName}
                            </div>
                        )}
                        {p.categoryName && (
                            <div className="text-sm text-gray-500">
                                Danh mục: {p.categoryName}
                            </div>
                        )}

                        <div
                            className="mt-4 prose max-w-none"
                            dangerouslySetInnerHTML={{
                                __html: (p.description ?? "").replace(/\n/g, "<br/>"),
                            }}
                        />

                        <div className="mt-6">
                            <h3 className="font-medium mb-2">Các phiên bản (SKU)</h3>
                            <div className="border rounded divide-y">
                                {p.variants.map((v) => (
                                    <div
                                        key={v.id}
                                        className="p-3 flex items-center justify-between flex-wrap gap-3"
                                    >
                                        <div>
                                            <div className="font-medium">
                                                {v.sku}
                                                {v.isDefault ? " • Mặc định" : ""}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {v.sizeText ? `Kích thước: ${v.sizeText} • ` : ""}
                                                {v.material || ""}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="font-semibold">
                                                {v.price.toLocaleString("vi-VN")} ₫
                                            </div>
                                            <AddToCartButton variantId={v.id} disabled={v.stockQty <= 0} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {p.datasheetUrl && (
                            <a
                                href={p.datasheetUrl}
                                className="inline-block mt-4 underline"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Tải datasheet
                            </a>
                        )}
                    </div>
                </div>
            </div>
        );
    } catch (e: any) {
        // Nếu backend trả 404 → hiển thị trang 404
        if (typeof e?.message === "string" && e.message.includes("404")) {
            notFound();
        }
        // Lỗi khác → ném lại để Next hiển thị error overlay dev
        throw e;
    }
}
