"use client";

export default function FacebookButton() {
    const handleClick = () => {
        window.location.href = "/bff/auth/oauth/facebook";
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="w-full border rounded py-2 text-sm flex items-center justify-center gap-2 hover:bg-gray-50"
        >
            <span>Đăng nhập với Facebook</span>
        </button>
    );
}
