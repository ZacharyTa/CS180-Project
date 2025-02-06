"use client";

import { useEffect, useState } from "react";
import { supabase } from "@lib/supabase";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login"); // Redirect if not logged in
      } else {
        setUser(user);
      }
    };
    getUser();
  }, [router]);

  // Show loading state while checking auth
  if (user === null) return <p>Loading...</p>;

  return <>{children}</>;
}
