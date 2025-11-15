import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    const body = await req.text();

    const res = await backendFetch("/api/cart/items", {
        method: "POST",
        headers: {
            "content-type": req.headers.get("content-type") ?? "application/json",
            cookie: req.headers.get("cookie") ?? "",
        },
        body,
        cache: "no-store",
    });

    const text = await res.text();
    const out = new NextResponse(text, {
        status: res.status,
        headers: {
            "content-type": res.headers.get("content-type") ?? "application/json",
        },
    });

    const setCookie = res.headers.get("set-cookie");
    if (setCookie) out.headers.set("set-cookie", setCookie);

    return out;
}
