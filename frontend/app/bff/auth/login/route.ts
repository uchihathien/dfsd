import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/api";

const ONE_HOUR = 60 * 60;
const SEVEN_DAYS = 60 * 60 * 24 * 7;

type LoginSuccess = {
    accessToken: string;
    refreshToken: string;
    user?: unknown;
};

type LoginError = {
    error?: string;
};

function isLoginSuccess(payload: unknown): payload is LoginSuccess {
    if (!payload || typeof payload !== "object") return false;
    const maybe = payload as Record<string, unknown>;
    return typeof maybe.accessToken === "string" && typeof maybe.refreshToken === "string";
}

function parseJson(text: string): unknown {
    try {
        return JSON.parse(text) as unknown;
    } catch {
        return text;
    }
}

export async function POST(req: NextRequest) {
    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const backendRes = await backendFetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body ?? {}),
        cache: "no-store",
    });

    const text = await backendRes.text();
    const parsed = text ? parseJson(text) : null;

    if (!backendRes.ok) {
        const message =
            typeof parsed === "string"
                ? parsed
                : typeof parsed === "object" && parsed !== null && "error" in parsed
                ? String((parsed as LoginError).error)
                : "Login failed";
        return NextResponse.json({ error: message }, { status: backendRes.status });
    }

    if (!isLoginSuccess(parsed)) {
        return NextResponse.json({ error: "Invalid login response from backend" }, { status: 500 });
    }

    const res = NextResponse.json(parsed);

    const secure = process.env.NODE_ENV === "production";
    res.cookies.set("access_token", parsed.accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure,
        maxAge: ONE_HOUR,
        path: "/",
    });

    res.cookies.set("refresh_token", parsed.refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure,
        maxAge: SEVEN_DAYS,
        path: "/",
    });

    return res;
}
