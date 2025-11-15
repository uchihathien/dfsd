import "./globals.css";
import Header from "@/components/Header";
import Providers from "../providers/providers";
import type { ReactNode } from "react";

export const metadata = { title: "Ecommerce", description: "Shop cơ khí" };

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="vi">
        <body>
        <Providers>
            <Header />
            {children}
        </Providers>
        </body>
        </html>
    );
}
