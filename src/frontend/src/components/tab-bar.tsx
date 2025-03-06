import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Heart, LogOut } from "lucide-react";

const TabBar = ({ onLogout }: { onLogout: () => void }) => {
  const currentPath = usePathname();

  return (
    <div className="fixed top-0 z-20 w-full shadow-md flex items-center justify-between bg-[#3a3a5a] border-b border-white border-opacity-20 p-4">

      <div className="flex-grow flex justify-center gap-48">
        <Link href="/fyp" className={`flex flex-col items-center text-white ${currentPath === "/fyp" ? "font-extrabold" : "font-normal"}`}>
          <Heart size={20} />
          <div className="text-sm font-bold">For You</div>
        </Link>
        <Link href="/profile" className={`flex flex-col items-center text-white ${currentPath === "/profile" ? "font-extrabold" : "font-normal"}`}>
          <Home size={20} />
          <div className="text-sm font-bold">Profile</div>
        </Link>
      </div>

      {/* Logout Button */}
      <button onClick={onLogout} className="text-white flex items-center mr-4">
        <LogOut size={18} className="mr-2" />
        <div className="text-sm font-bold">Logout</div>
      </button>
    </div>
  );
};

export default TabBar;
