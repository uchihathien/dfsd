import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {

    const access = (await cookies()).get("access_token")?.value;
    if (!access) {
        return NextResponse.json({ message: "NOT_LOGGED_IN" }, { status: 401 });
    }

    // gọi backend thật
    const r = await fetch(`${process.env.BACKEND_URL}/api/auth/me`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
    });

    if (!r.ok) {
        return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 401 });
    }

    const me = await r.json();
    return NextResponse.json(me);
}
