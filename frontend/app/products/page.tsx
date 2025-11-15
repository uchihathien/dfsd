import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { API_BASE } from "@/lib/api";

export default async function ProductsPage(props: any) {
    const searchParams = await props.searchParams;

    const page = Number(searchParams.page ?? 0);
    const q = searchParams.q ?? "";
    const brandId = searchParams.brandId ?? "";
    const categoryId = searchParams.categoryId ?? "";

    const url = `${API_BASE}/api/products?page=${page}&q=${q}&brandId=${brandId}&categoryId=${categoryId}`;
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();

    return (
        <div className="w-full bg-gray-50">
            {/* ------- FILTER BAR (modern) -------- */}
            <div className="sticky top-0 z-20 bg-white shadow-sm border-b py-4">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">

                    <h1 className="text-xl font-semibold text-gray-800 tracking-wide">
                        Sản phẩm cơ khí
                    </h1>

                    <form className="flex items-center gap-3 w-full max-w-md">
                        <input
                            type="text"
                            name="q"
                            defaultValue={q}
                            placeholder="Tìm kiếm sản phẩm..."
                            className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none transition"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Tìm
                        </button>
                    </form>
                </div>
            </div>

            {/* ------- LIST PRODUCTS -------- */}
            <div className="max-w-7xl mx-auto px-4 py-10">
                {data.content.length === 0 && (
                    <p className="text-center text-gray-500 py-20">
                        Không tìm thấy sản phẩm nào phù hợp.
                    </p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {data.content.map((p: any) => (
                        <ProductCard key={p.id} p={p} />
                    ))}
                </div>

                {/* ------- Pagination -------- */}
                <div className="mt-10 flex justify-center">
                    <Pagination page={data.number} total={data.totalPages} />
                </div>
            </div>
        </div>
    );
}
