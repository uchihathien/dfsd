"use client";

import { useQuery } from "@tanstack/react-query";

export function useMe() {
    return useQuery({
        queryKey: ["me"],
        queryFn: async () => {
            const res = await fetch("/bff/auth/me", {
                credentials: "include",
            });

            if (!res.ok) return null;
            return res.json();
        },
    });
}
