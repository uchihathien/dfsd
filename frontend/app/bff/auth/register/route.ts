import { NextResponse } from "next/server";
import { API_BASE } from "@/lib/api";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const r = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        // Nếu backend trả lỗi HTML => không parse JSON
        let data: any = null;
        try {
            data = await r.json();
        } catch (e) {
            return NextResponse.json(
                { error: "BACKEND_NOT_JSON", status: r.status },
                { status: 500 }
            );
        }

        // Backend trả thành công -> BFF set cookie JWT
        if (r.ok) {
            const access = data.accessToken;
            const refresh = data.refreshToken;

            const res = NextResponse.json({ success: true, user: data.user ?? null });
            const secure = process.env.NODE_ENV === "production";

            // Set cookie
            res.cookies.set("access_token", access, {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 15,
                secure,
            });

            res.cookies.set("refresh_token", refresh, {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
                secure,
            });

            if (data.cartId) {
                res.cookies.set("cart_id", data.cartId, {
                    httpOnly: true,
                    sameSite: "lax",
                    path: "/",
                    maxAge: 60 * 60 * 24 * 30,
                    secure,
                });
            }

            return res;
        }

        // Backend lỗi → trả về lỗi cho FE
        return NextResponse.json(data, { status: r.status });

    } catch (err: any) {
        return NextResponse.json(
            { error: "BFF_EXCEPTION", message: err.message },
            { status: 500 }
        );
    }
}
