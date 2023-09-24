"use client";
import { useSession } from "next-auth/react";
import type { ReactNode } from "react";

const AdminProtectedRoute = ({ Component }: { Component: ReactNode }) => {
  const { data: session } = useSession();
  if (!session?.user.isAdmin) return null;
  return Component;
};

export default AdminProtectedRoute;
