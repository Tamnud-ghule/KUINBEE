import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

type RequireAdminProps = {
  path: string;
  component: React.ComponentType;
};

export function RequireAdmin({ path, component: Component }: RequireAdminProps) {
  const { user, isLoading } = useAuth();

  return (
    <Route path={path}>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : user && user.isAdmin ? (
        <Component />
      ) : (
        <Redirect to="/admin/login" />
      )}
    </Route>
  );
}
