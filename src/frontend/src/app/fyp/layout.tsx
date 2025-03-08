"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import TabBar from "@/components/tab-bar";

export default function FYPLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <p>Loading...</p>;
  return (
    <div className="min-h-screen bg-background pb-20 mt-20">
      <TabBar />
      {children}
    </div>
  );
}
