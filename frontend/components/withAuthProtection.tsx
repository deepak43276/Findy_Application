// @ts-nocheck
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import React from "react";

export function withAuthProtection(WrappedComponent) {
  const ProtectedComponent = (props) => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.replace("/login");
      }
    }, [user, router]);

    if (!user) return null; // Or a loading spinner

    return <WrappedComponent {...props} />;
  };

  ProtectedComponent.displayName = `withAuthProtection(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return ProtectedComponent;
}
