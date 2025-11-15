export const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";

export const OAUTH_REDIRECT =
    process.env.NEXT_PUBLIC_OAUTH_REDIRECT ?? "http://localhost:3000/oauth2/callback";

/**
 * Gọi trực tiếp BACKEND từ BFF (route.ts trên server)
 */
export async function backendFetch(
    path: string,
    init?: RequestInit
): Promise<Response> {
    const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
    return fetch(url, {
        ...init,
        // BFF luôn chạy ở server nên không cần credentials
    });
}
