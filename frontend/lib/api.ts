// frontend/lib/api.ts
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";

type NextFetchInit = RequestInit & {
    next?: { revalidate?: number | false; tags?: string[] };
};

export async function apiFetch<T = unknown>(path: string, init?: NextFetchInit): Promise<T> {
    const url = new URL(path.startsWith("/") ? path : `/${path}`, API_BASE).toString();
    const isServer = typeof window === "undefined";

    const { next: nextCfg, ...rest } = init ?? {};
    const res = await fetch(url, isServer ? { next: nextCfg, ...rest } : rest);

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed: ${res.status} ${res.statusText}`);
    }
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
}
