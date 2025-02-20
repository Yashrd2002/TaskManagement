import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { CgProfile } from "react-icons/cg";
import { GrTask, GrLogout } from "react-icons/gr";
import { IoMdClose } from "react-icons/io";
import { SiSimpleanalytics, SiTask } from "react-icons/si";

import { toast } from "react-toastify";

interface SidebarProps {
  toggleSidebar: () => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ toggleSidebar, isOpen }) => {
  const pathname = usePathname()
  const url = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const handleLogout = async (): Promise<void> => {
    try {
      const response = await fetch(`${url}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/");
        toast.success("Logout successful");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred during logout.");
      console.error(error);
    }
  };

  return (
    <div className="p-4 w-full max-w-[300px] bg-black h-screen">
      <div className="flex justify-end md:hidden">
        {isOpen && (
          <IoMdClose
            className="text-white text-[30px]"
            onClick={toggleSidebar}
          />
        )}
      </div>

      <div className="flex flex-col items-center">
        <SiTask className="w-[30px] h-[30px] text-[#B0EB0A]" />
        <div className="urbanist-800 text-[40px] z-10 bg-transparent">
          ZEN<span className="text-[#B0EB0A]">TASK</span>
        </div>
      </div>
      <div className="flex flex-col gap-12 mt-10 text-[24px] px-8">
        <Link
          href="/dashboard/analysis"
          className={`urbanist-800 flex gap-2 items-center ${
            pathname.includes("analysis") ? "text-[#B0EB0A]" : ""
          }`}
        >
          {pathname.includes("analysis") ? (
            <SiSimpleanalytics className="text-[#B0EB0A]" />
          ) : (
            <SiSimpleanalytics />
          )}
          Analytics
        </Link>
        <Link
          href="/dashboard/task"
          className={`urbanist-800 flex gap-2 items-center ${
            pathname.includes("task") ? "text-[#B0EB0A]" : ""
          }`}
        >
          {pathname.includes("task") ? (
            <GrTask className="text-[#B0EB0A]" />
          ) : (
            <GrTask />
          )}
          Tasks
        </Link>
        <Link
          href="/dashboard/profile"
          className={`urbanist-800 flex gap-2 items-center ${
            pathname.includes("profile") ? "text-[#B0EB0A]" : ""
          }`}
        >
          {pathname.includes("profile") ? (
            <CgProfile className="text-[#B0EB0A]" />
          ) : (
            <CgProfile />
          )}
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="urbanist-800 flex gap-2 items-center text-red-600 hover:text-red-800 transition-all"
        >
          <GrLogout /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
