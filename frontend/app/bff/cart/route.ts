import { NextRequest, NextResponse } from "next/server";
import { API_BASE } from "@/lib/api";

function bearer(req: NextRequest) {
    const token =
        req.cookies.get("accessToken")?.value ??
        req.cookies.get("access_token")?.value ??
        "";

    return {
        Authorization: token ? `Bearer ${token}` : undefined
    };
}

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const res = await fetch(`${API_BASE}/api/cart`, {
        method: "GET",
        headers: {
            cookie: req.headers.get("cookie") ?? "",
            accept: "application/json",
            ...bearer(req),
        } as HeadersInit,  // 👈 ép kiểu cho chắc
        credentials: "include",
        cache: "no-store",
    });

    const body = await res.text();

    const out = new NextResponse(body, {
        status: res.status,
        headers: {
            "content-type": res.headers.get("content-type") ?? "application/json",
        },
    });

    const setCookies = res.headers.getSetCookie?.()
        ?? (res.headers.get("set-cookie") ? [res.headers.get("set-cookie")!] : []);

    for (const c of setCookies) {
        out.headers.append("set-cookie", c);
    }

    return out;
}
