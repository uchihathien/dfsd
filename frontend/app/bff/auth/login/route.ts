import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const backendRes = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
    });
    const data = await backendRes.json();

    if (!backendRes.ok) {
        return NextResponse.json(data, { status: backendRes.status });
    }

    // Nhận accessToken, refreshToken -> set HttpOnly cookies
    const res = NextResponse.json({ ok: true });
    res.cookies.set("access_token", data.accessToken, { httpOnly: true, sameSite: "lax", path: "/" });
    res.cookies.set("refresh_token", data.refreshToken, { httpOnly: true, sameSite: "lax", path: "/" });
    return res;
}
