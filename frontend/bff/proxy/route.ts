import { API_BASE } from "@/lib/api";

export async function POST(req: Request) {
    const { path, method, body } = await req.json();

    const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
    });

    const text = await res.text();

    return new Response(text, {
        status: res.status,
        headers: { "set-cookie": res.headers.get("set-cookie") ?? "" },
    });
}
