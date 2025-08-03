// @ts-nocheck
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import React from "react";

export function withAdminProtection(WrappedComponent) {
  const ProtectedComponent = (props) => {
    const { isAdmin, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (user && !isAdmin) {
        router.replace("/");
      }
    }, [isAdmin, user, router]);

    if (!user) return null;
    if (!isAdmin) return null;

    return <WrappedComponent {...props} />;
  };

  ProtectedComponent.displayName = `withAdminProtection(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return ProtectedComponent;
}
