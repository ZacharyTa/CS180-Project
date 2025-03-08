import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Home, Heart, LogOut } from "lucide-react";

const TabBar = () => {
  const currentPath = usePathname();

  return (
    <div className="fixed top-0 z-20 w-full shadow-md flex items-center bg-[#3a3a5a] border-b border-white border-opacity-20 p-4">
      <div className="flex-row flex items-center justify-between gap-4 h-full">
        <Link
          href="/fyp"
          className={`text-white ${
            currentPath === "/fyp" ? "font-extrabold" : "font-normal"
          }`}
        >
          <Heart size={20} />
          <div className="text-sm font-bold">For You</div>
        </Link>
        {/* Logout Button */}
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-white mr-4"
        >
          <LogOut size={18} className="mr-2" />
          <div className="text-sm font-bold">Logout</div>
        </button>
        <Link
          href="/profile"
          className={`text-white ${
            currentPath === "/profile" ? "font-extrabold" : "font-normal"
          }`}
        >
          <Home size={20} />
          <div className="text-sm font-bold">Profile</div>
        </Link>
      </div>
    </div>
  );
};

export default TabBar;
