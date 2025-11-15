import "./../styles/globals.css";
import type { ReactNode } from "react";
import Header from "@/components/Header";

export const metadata = {
    title: "Cửa hàng cơ khí",
    description: "Website bán sản phẩm cơ khí",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="vi">
        <body className="bg-gray-50 text-gray-900">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
        </body>
        </html>
    );
}
