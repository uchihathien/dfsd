import { NextRequest, NextResponse } from "next/server";
import { API_BASE, OAUTH_REDIRECT } from "@/lib/api";

export async function GET(_req: NextRequest) {
    const url = `${API_BASE}/oauth2/authorization/google?redirect_uri=${encodeURIComponent(
        OAUTH_REDIRECT
    )}`;
    return NextResponse.redirect(url);
}
