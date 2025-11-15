import Link from "next/link";
import AuthStatus from "./AuthStatus";
import { headers } from "next/headers";

type Me = {
    id: number;
    email: string;
    fullName?: string | null;
    role?: string | null;
};

async function fetchMe(): Promise<Me | null> {
    const h = await headers();
    const proto = h.get("x-forwarded-proto") ?? "http";
    const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
    const origin = `${proto}://${host}`;

    const res = await fetch(`${origin}/bff/auth/me`, {
        headers: { cookie: h.get("cookie") ?? "" },
        cache: "no-store",
    });

    if (!res.ok) return null;
    return (await res.json()) as Me;
}

export default async function Header() {
    const me = await fetchMe();

    return (
        <header className="border-b bg-white">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                <Link href="/" className="font-semibold text-lg">
                    Cơ khí<span className="text-blue-600">Store</span>
                </Link>

                <nav className="flex items-center gap-4 text-sm">
                    <Link href="/products">Sản phẩm</Link>
                    <Link href="/cart">Giỏ hàng</Link>
                </nav>

                <AuthStatus me={me} />
            </div>
        </header>
    );
}
