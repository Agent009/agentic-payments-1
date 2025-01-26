"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@components/ui/button";
import { ScrollArea } from "@components/ui/scroll-area";
import { constants } from "@lib/constants";
import { cn } from "@lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r bg-background h-screen flex flex-col">
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 py-2">
          {constants.sidebarLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant={pathname === link.href ? "secondary" : "ghost"}
                className={cn("w-full justify-start gap-2", {
                  "bg-accent": pathname === link.href,
                })}
              >
                <link.icon className="h-4 w-4" />
                {link.title}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
