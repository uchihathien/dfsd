import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { idToken } = await req.json();

        if (!idToken) {
            return NextResponse.json({ error: "ID_TOKEN_REQUIRED" }, { status: 400 });
        }

        const r = await fetch(`${process.env.BACKEND_URL}/api/auth/oauth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
            cache: "no-store",
        });

        const data = await r.json();

        if (!r.ok) return NextResponse.json(data, { status: r.status });

        const res = NextResponse.json({ ok: true });
        res.cookies.set("access_token", data.accessToken, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
        });
        res.cookies.set("refresh_token", data.refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
        });

        return res;
    } catch (err) {
        console.error("BFF Google login error:", err);
        return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
    }
}
