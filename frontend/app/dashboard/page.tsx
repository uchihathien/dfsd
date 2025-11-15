import { fetchBackendWithAuth } from "@/lib/server-auth";

async function getProfile() {
    const res = await fetchBackendWithAuth("/auth/me");
    if (!res.ok) {
        throw new Error("Failed to load profile");
    }
    return res.json();
}

export default async function DashboardPage() {
    const profile = await getProfile();

    return (
        <section className="max-w-3xl mx-auto space-y-4 py-10">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <div className="rounded border p-4 bg-white shadow-sm space-y-2">
                <p className="text-sm text-gray-500">Bạn đã đăng nhập bằng JWT.</p>
                <div>
                    <p className="font-medium">Email: {profile.email}</p>
                    <p className="font-medium">Họ tên: {profile.fullName}</p>
                    <p className="font-medium">Quyền: {profile.role}</p>
                </div>
            </div>
        </section>
    );
}
