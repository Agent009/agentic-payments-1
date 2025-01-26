import React from "react";

import { Inter } from "next/font/google";
import Link from "next/link";

import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { QueryClientProvider } from "@components/context/QueryClientProvider";
import { SessionProvider } from "@components/context/SessionProvider";
import { ThemeProvider } from "@components/context/ThemeProvider";
import { constants } from "@lib/constants";
import "@styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      {/*<head>*/}
      {/*  <script*/}
      {/*    dangerouslySetInnerHTML={{*/}
      {/*      __html: `*/}
      {/*        if ('serviceWorker' in navigator) {*/}
      {/*          window.addEventListener('load', function() {*/}
      {/*            navigator.serviceWorker.register('/service-worker.js').then(function(registration) {*/}
      {/*              console.log('ServiceWorker registration successful with scope: ', registration.scope);*/}
      {/*            }, function(err) {*/}
      {/*              console.log('ServiceWorker registration failed: ', err);*/}
      {/*            });*/}
      {/*          });*/}
      {/*        }*/}
      {/*      `,*/}
      {/*    }}*/}
      {/*  />*/}
      {/*  <title></title>*/}
      {/*</head>*/}
      <body className={inter.className}>
        <QueryClientProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <SessionProvider session={session}>
              <div className="flex flex-col min-h-screen">
                <header className="bg-background border-b">
                  <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">
                      <Link href={constants.routes.home}>{constants.app.name}</Link>
                    </h1>
                    <ThemeToggle />
                  </div>
                </header>
                <main className="flex-grow">{children}</main>
              </div>
              <Toaster />
            </SessionProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
