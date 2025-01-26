"use client";

import { useState, useEffect } from "react";

import { Search, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useDebounce } from "@hooks/use-debounce.ts";

import { UserNav } from "./user-nav.tsx";
import { Notifications } from "../notifications.tsx";

export function MainNav() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const router = useRouter();
  const pathname = usePathname();
  const title = pathname.split("/").pop() || "AG2AG";

  useEffect(() => {
    if (debouncedSearch) {
      router.push(`/search?q=${encodeURIComponent(debouncedSearch)}`);
    }
  }, [debouncedSearch, router]);

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 gap-4">
        <h1 className="text-xl font-semibold capitalize hidden md:block">{title}</h1>
        <div className="flex-1 flex items-center gap-4 justify-end">
          <div className="w-full md:w-96">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks"
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Settings className="h-5 w-5" />
          </Button>
          <Notifications />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
