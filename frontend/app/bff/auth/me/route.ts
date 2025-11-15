import { backendFetch } from "@/lib/api";

export async function GET() {
    const res = await backendFetch("/api/auth/me", {
        credentials: "include",
    });

    const data = await res.json();
    return Response.json(data, { status: res.status });
}
