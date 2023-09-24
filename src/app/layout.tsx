"use client";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import Header from "~/components/header/Header";
import { api } from "~/utils/api";
import "./globals.css";

const RootLayout = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) => {
  return (
    <html lang="en">
      <head>
        <title>Job Hive</title>
        <meta name="description" content="Buzzing with Job Opportunity" />
        <link rel="icon" href="/assets/logo/hexagon.svg" />
      </head>
      <SessionProvider session={session}>
        <body className="grid min-h-[100dvh] grid-rows-[auto_1fr] bg-light-500">
          <Header />
          <Toaster />
          {children}
        </body>
      </SessionProvider>
    </html>
  );
};
export default api.withTRPC(RootLayout);
