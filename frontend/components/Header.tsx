"use client";

import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { useMe } from "@/hooks/useMe";

export default function Header() {
    const { data: me, isLoading } = useMe();

    return (
        <header className="w-full border-b bg-white sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">

                {/* Logo */}
                <Link href="/" className="font-semibold text-lg">
                    Cửa hàng cơ khí
                </Link>

                {/* Navigation */}
                <nav className="ml-auto flex items-center gap-5">

                    {/* Link Products */}
                    <Link
                        href="/products"
                        className="text-sm font-medium hover:text-black"
                    >
                        Products
                    </Link>

                    {/* Link Cart */}
                    <Link
                        href="/cart"
                        className="text-sm font-medium hover:text-black"
                    >
                        Cart
                    </Link>

                    {/* Auth section */}
                    {isLoading ? (
                        <span className="text-gray-400 text-sm animate-pulse">
                            Đang tải...
                        </span>
                    ) : me ? (
                        <>
                            <span className="inline-flex items-center gap-2 text-green-700 text-sm">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    className="w-4 h-4"
                                >
                                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.7a1 1 0 00-1.4-1.4L9 9.2 7.7 7.9a1 1 0 10-1.4 1.4l2 2a1 1 0 001.4 0l3-3z" />
                                </svg>
                                {me.fullName || me.email}
                            </span>

                            <LogoutButton />
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-sm hover:underline hover:text-black"
                            >
                                Đăng nhập
                            </Link>

                            <Link
                                href="/register"
                                className="text-sm hover:underline hover:text-black"
                            >
                                Đăng ký
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
