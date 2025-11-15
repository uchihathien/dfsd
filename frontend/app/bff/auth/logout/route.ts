import { NextResponse } from "next/server";

export async function POST() {
    const res = NextResponse.json({ ok: true });
    const secure = process.env.NODE_ENV === "production";
    res.cookies.set("access_token", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
        secure,
        sameSite: "lax",
    });
    res.cookies.set("refresh_token", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
        secure,
        sameSite: "lax",
    });
    return res;
}
