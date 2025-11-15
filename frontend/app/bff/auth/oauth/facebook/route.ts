import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { accessToken } = await req.json();
    const r = await fetch(`${process.env.BACKEND_URL}/api/auth/oauth/facebook`, {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ accessToken }),
        cache: "no-store",
    });
    const data = await r.json();
    if (!r.ok) return NextResponse.json(data, { status: r.status });

    const res = NextResponse.json({ ok: true });
    res.cookies.set("access_token", data.accessToken, { httpOnly: true, sameSite: "lax", path: "/" });
    res.cookies.set("refresh_token", data.refreshToken, { httpOnly: true, sameSite: "lax", path: "/" });
    return res;
}
