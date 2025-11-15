import { cookies } from "next/headers";
import { API_BASE } from "@/lib/api";

export async function fetchBackendWithAuth(path: string, init?: RequestInit) {
    const token = cookies().get("access_token")?.value;
    if (!token) {
        throw new Error("Missing authentication token");
    }

    const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
    const headers = new Headers(init?.headers ?? {});
    headers.set("Authorization", `Bearer ${token}`);

    return fetch(url, {
        ...init,
        headers,
        cache: "no-store",
    });
}
