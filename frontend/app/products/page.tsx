// frontend/app/products/page.tsx
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import type {
    BrandDto,
    CategoryNodeDto,
    Page,
    ProductListItemDto,
} from "@/types/catalog";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

// Trong dev tránh cache gây rác; có thể bỏ dòng này nếu bạn muốn.
export const dynamic = "force-dynamic";

export default async function ProductsPage({
                                               searchParams,
                                           }: {
    searchParams?: SearchParams;
}) {
    // Next 15/16: searchParams là Promise -> cần await
    const sp = (await searchParams) ?? {};
    const q = getParam(sp, "q", "");
    const brandId = getParam(sp, "brandId", "");
    const categoryId = getParam(sp, "categoryId", "");
    const page = Number(getParam(sp, "page", "0"));

    let brands: BrandDto[] = [];
    let categories: CategoryNodeDto[] = [];
    let pageData: Page<ProductListItemDto> | null = null;
    let errorMsg = "";

    try {
        const query = buildQuery({
            q,
            brandId,
            categoryId,
            page: String(page),
            size: "12",
        });

        [brands, categories, pageData] = await Promise.all([
            apiFetch<BrandDto[]>("/api/brands"),
            apiFetch<CategoryNodeDto[]>("/api/categories"),
            apiFetch<Page<ProductListItemDto>>(`/api/products?${query}`),
        ]);
    } catch (e: any) {
        errorMsg =
            typeof e?.message === "string" ? e.message : "Không tải được dữ liệu.";
    }

    return (
        <div className="mx-auto max-w-7xl p-4 md:p-6">
            <h1 className="text-2xl font-semibold mb-4">Sản phẩm</h1>

            {errorMsg && (
                <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-sm">
                    {errorMsg}
                </div>
            )}

            <div className="grid grid-cols-12 gap-6">
                {/* Sidebar filter */}
                <aside className="col-span-12 md:col-span-3 space-y-6">
                    <FilterSection title="Từ khóa">
                        <form action="/products" className="flex gap-2">
                            <input
                                name="q"
                                defaultValue={q}
                                placeholder="Tìm..."
                                className="w-full border rounded px-3 py-2"
                            />
                            <button className="border px-3 rounded">Lọc</button>
                        </form>
                    </FilterSection>

                    <FilterSection title="Thương hiệu">
                        <BrandList
                            brands={brands}
                            q={q}
                            categoryId={categoryId}
                            currentBrandId={brandId}
                        />
                    </FilterSection>

                    <FilterSection title="Danh mục">
                        <CategoryTree
                            nodes={categories}
                            currentCategoryId={categoryId}
                            q={q}
                            brandId={brandId}
                        />
                    </FilterSection>
                </aside>

                {/* Product list */}
                <section className="col-span-12 md:col-span-9">
                    {!pageData ? (
                        <div className="rounded border p-4">Không có dữ liệu để hiển thị.</div>
                    ) : pageData.content.length === 0 ? (
                        <div className="rounded border p-4">
                            Chưa có sản phẩm phù hợp bộ lọc.
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {pageData.content.map((p) => (
                                    <ProductCard key={p.id} p={p} />
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-center gap-2 mt-6">
                                {Array.from({ length: pageData.totalPages }).map((_, i) => (
                                    <Link
                                        key={i}
                                        href={`/products?${buildQuery({
                                            q,
                                            brandId,
                                            categoryId,
                                            page: String(i),
                                        })}`}
                                        className={`px-3 py-1 border rounded ${
                                            i === pageData.number ? "font-semibold" : ""
                                        }`}
                                    >
                                        {i + 1}
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}

/* ========================= Helpers & UI pieces ========================= */

function getParam(
    sp: Record<string, string | string[] | undefined>,
    key: string,
    def = ""
) {
    const v = sp[key];
    return (Array.isArray(v) ? v[0] : v) ?? def;
}

// Bỏ các param rỗng để tránh URL kiểu brandId=&categoryId=
function buildQuery(params: Record<string, string | undefined>) {
    const usp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
        if (v && v !== "") usp.set(k, v);
    }
    return usp.toString();
}

function FilterSection({
                           title,
                           children,
                       }: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <h3 className="font-medium mb-2">{title}</h3>
            {children}
        </div>
    );
}

/** Link dùng trong filter — KHÔNG trả <li> để tránh <li> lồng <li> */
function FilterLink({
                        href,
                        active,
                        children,
                    }: {
    href: string;
    active?: boolean;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className={`block px-2 py-1 rounded hover:bg-gray-100 ${
                active ? "font-semibold bg-gray-100" : ""
            }`}
        >
            {children}
        </Link>
    );
}

/** Cây danh mục: UL > LI > (FilterLink + UL con)  */
function CategoryTree({
                          nodes,
                          currentCategoryId,
                          q,
                          brandId,
                          isRoot = true,
                          level = 0,
                      }: {
    nodes: CategoryNodeDto[];
    currentCategoryId?: string;
    q: string;
    brandId: string;
    isRoot?: boolean;
    level?: number;
}) {
    return (
        <ul className={`space-y-1 ${level ? "pl-4" : ""}`}>
            {isRoot && (
                <li>
                    <FilterLink
                        href={`/products?${buildQuery({ q, brandId })}`}
                        active={!currentCategoryId}
                    >
                        Tất cả
                    </FilterLink>
                </li>
            )}

            {nodes.map((n) => {
                const href = `/products?${buildQuery({
                    q,
                    brandId,
                    categoryId: String(n.id),
                })}`;
                return (
                    <li key={n.id}>
                        <FilterLink
                            href={href}
                            active={currentCategoryId === String(n.id)}
                        >
                            {n.name}
                        </FilterLink>

                        {n.children?.length ? (
                            <CategoryTree
                                nodes={n.children}
                                currentCategoryId={currentCategoryId}
                                q={q}
                                brandId={brandId}
                                isRoot={false}
                                level={level + 1}
                            />
                        ) : null}
                    </li>
                );
            })}
        </ul>
    );
}

/** Danh sách brand (UL > LI > FilterLink) */
function BrandList({
                       brands,
                       q,
                       categoryId,
                       currentBrandId,
                   }: {
    brands: BrandDto[];
    q: string;
    categoryId: string;
    currentBrandId: string;
}) {
    return (
        <ul className="space-y-2">
            <li>
                <FilterLink
                    href={`/products?${buildQuery({ q, categoryId })}`}
                    active={!currentBrandId}
                >
                    Tất cả
                </FilterLink>
            </li>
            {brands.map((b) => (
                <li key={b.id}>
                    <FilterLink
                        href={`/products?${buildQuery({
                            q,
                            categoryId,
                            brandId: String(b.id),
                        })}`}
                        active={currentBrandId === String(b.id)}
                    >
                        {b.name}
                    </FilterLink>
                </li>
            ))}
        </ul>
    );
}

function ProductCard({ p }: { p: ProductListItemDto }) {
    return (
        <Link
            href={`/products/${p.slug}`}
            className="border rounded p-3 block hover:shadow-sm"
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={p.thumbnailUrl || "https://placehold.co/400x300"}
                alt={p.name}
                className="w-full h-40 object-cover rounded"
            />
            <div className="mt-2 text-sm text-gray-500">{p.brandName}</div>
            <div className="font-medium line-clamp-2">{p.name}</div>
            <div className="mt-1 font-semibold">
                {(p.priceFrom ?? 0).toLocaleString("vi-VN")} ₫
            </div>
        </Link>
    );
}
