"use client";

export default function LogoutButton() {
    async function logout() {
        await fetch("/bff/auth/logout", { method: "POST" });
        location.reload();
    }

    return (
        <button className="text-red-600" onClick={logout}>
            Logout
        </button>
    );
}
