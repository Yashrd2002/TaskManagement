"use client"
import { ReactNode, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { IoMenu } from "react-icons/io5";
import ProtectedRoute from "@/components/ProtectedRoute";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <ProtectedRoute>
      <div className="flex h-screen ">
        <div
          className="md:hidden absolute text-[30px] top-2 left-3 z-20 bg-black"
          onClick={toggleSidebar}
        >
          {!isOpen && <IoMenu />}
        </div>

        <div
          className={`md:static absolute justify-center border-r border-r-[#969696] z-30 ${
            isOpen ? "" : "md:block hidden"
          }`}
        >
          <Sidebar toggleSidebar={toggleSidebar} isOpen={isOpen} />
        </div>
        <div className="flex-1  overflow-y-auto md:mb-0 mb-20 w-full md:pt-0 pt-10">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Layout;
