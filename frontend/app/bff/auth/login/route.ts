import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    let body: any = null;

    // Đọc JSON an toàn — không crash nếu frontend gửi body rỗng
    try {
        body = await req.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid request body" },
            { status: 400 }
        );
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_BASE;
    if (!backendUrl) {
        return NextResponse.json(
            { error: "Missing NEXT_PUBLIC_API_BASE" },
            { status: 500 }
        );
    }

    // Gửi request xuống Spring Boot
    const backendRes = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
        credentials: "include",
    });

    // Đọc JSON an toàn — không crash nếu backend trả text / empty body
    let data: any = null;
    try {
        data = await backendRes.json();
    } catch {
        data = null;
    }

    // Nếu backend trả lỗi (401, 400, 500…)
    if (!backendRes.ok) {
        return NextResponse.json(
            data ?? { error: "Login failed" },
            { status: backendRes.status }
        );
    }

    // Nếu đăng nhập thành công → backend phải trả accessToken + refreshToken
    if (!data?.accessToken || !data?.refreshToken) {
        return NextResponse.json(
            { error: "Invalid login response from backend" },
            { status: 500 }
        );
    }

    // Trả response OK và set cookie httpOnly
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
}
