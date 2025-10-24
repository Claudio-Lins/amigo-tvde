"use client";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { LoadingButton } from "../loading-button";

interface SingOutProps {}

export function SingOut({}: SingOutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const { error } = await authClient.signOut();
    setLoading(false);
    if (error) {
      toast.error(error.message || "Something went wrong");
    } else {
      toast.success("Logged out successfully");
      router.push("/sign-in");
    }
  }
  return (
    <div className={cn("")}>
      <LoadingButton variant="destructive" onClick={handleLogout} loading={loading}>
        Logout
      </LoadingButton>
    </div>
  );
}
