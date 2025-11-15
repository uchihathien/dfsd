"use client";

import { useQuery } from "@tanstack/react-query";

export function useMe() {
    return useQuery({
        queryKey: ["me"],
        queryFn: async () => {
            const r = await fetch("/bff/auth/me", {
                credentials: "include",
                cache: "no-store",
            });

            if (r.status === 401) return null; // chưa đăng nhập
            if (!r.ok) throw new Error("Failed to load user");

            return r.json();
        },
        staleTime: 0,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
    });
}
