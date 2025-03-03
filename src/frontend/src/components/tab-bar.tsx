import { useRouter, usePathname } from "next/navigation";

const TabBar = () => {
  const router = useRouter();
  const currentPath = usePathname();

  return (
    <div className="fixed top-0 z-50 w-full backdrop-blur-xs shadow-md flex justify-center bg-gray-700/45">
      <div className="flex space-x-6 p-2 mix-blend-exclusion">
        <button
          role="tab"
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            currentPath === "/fyp" ? "font-extrabold" : "font-normal"
          }`}
          onClick={() => router.push("/fyp")}
        >
          For You
        </button>
        <button
          role="tab"
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            currentPath === "/profile" ? "font-extrabold" : "font-normal"
          }`}
          onClick={() => router.push("/profile")}
        >
          Profile
        </button>
      </div>
    </div>
  );
};

export default TabBar;
