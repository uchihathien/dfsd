import { NextRequest, NextResponse } from "next/server";
import { API_BASE } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    const payload = await req.text();
    const res = await fetch(`${API_BASE}/api/cart/items`, {
        method: "POST",
        headers: {
            cookie: req.headers.get("cookie") ?? "",
            "content-type": "application/json",
        },
        body: payload,
        cache: "no-store",
    });

    const body = await res.text();
    const out = new NextResponse(body, {
        status: res.status,
        headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
    });

    // forward set-cookie(cart_id) nếu có
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) out.headers.set("set-cookie", setCookie);
    return out;
}
