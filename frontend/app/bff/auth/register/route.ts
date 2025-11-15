import { NextResponse } from "next/server";

export async function POST(req: Request) {
    console.log("BACKEND_URL =", process.env.BACKEND_URL);
    console.log("FULL URL =", `${process.env.BACKEND_URL}/api/auth/register`);
    try {
        const body = await req.json();

        const r = await fetch(`${process.env.BACKEND_URL}/api/auth/register`, {
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

            const res = NextResponse.json({ success: true });

            // Set cookie
            res.cookies.set("access_token", access, {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 15,
            });

            res.cookies.set("refresh_token", refresh, {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
            });

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
