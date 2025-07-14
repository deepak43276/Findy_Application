import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function withAdminProtection<P>(Component: React.ComponentType<P>) {
  return function ProtectedComponent(props: P) {
    const { isAdmin, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (user && !isAdmin) {
        router.replace("/");
      }
    }, [isAdmin, user, router]);

    if (!user) {
      // Optionally, show a loading spinner or null while checking auth
      return null;
    }
    if (!isAdmin) {
      // Optionally, show an error message
      return null;
    }
    return <Component {...props} />;
  };
} 