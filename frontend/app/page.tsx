// frontend/app/page.tsx
// Home là Server Component; trong Next 16, searchParams là Promise → phải await

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function Home({
                                       searchParams,
                                   }: {
    searchParams: SearchParams;
}) {
    const sp = await searchParams; // 👈 bắt buộc
    const login = getParam(sp, "login"); // ví dụ bạn đang đọc ?login=success|error

    return (
        <main className="mx-auto max-w-7xl p-6">
            <h1 className="text-2xl font-semibold mb-2">Trang chủ</h1>

            {login && (
                <div className="mb-4 rounded border border-emerald-300 bg-emerald-50 p-3 text-sm">
                    Trạng thái đăng nhập: <b>{login}</b>
                </div>
            )}

            <p>Chào mừng đến cửa hàng cơ khí.</p>
            {/* Nội dung khác của bạn … */}
        </main>
    );
}

function getParam(
    sp: Record<string, string | string[] | undefined>,
    key: string,
    def = ""
) {
    const v = sp?.[key];
    return (Array.isArray(v) ? v[0] : v) ?? def;
}
