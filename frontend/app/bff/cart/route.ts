// frontend/app/bff/cart/route.ts
import { NextRequest, NextResponse } from "next/server";
import { API_BASE } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    // Forward toàn bộ cookie (cart_id + JWT) sang Spring Boot
    const res = await fetch(`${API_BASE}/api/cart`, {
        headers: {
            cookie: req.headers.get("cookie") ?? "",
            accept: "application/json",
        },
        cache: "no-store",
    });

    const body = await res.text();

    // Proxy response về FE
    const out = new NextResponse(body, {
        status: res.status,
        headers: {
            "content-type": res.headers.get("content-type") ?? "application/json",
        },
    });

    // Rất quan trọng: forward lại Set-Cookie (cart_id mới) cho browser
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
        out.headers.set("set-cookie", setCookie);
    }

    return out;
}
