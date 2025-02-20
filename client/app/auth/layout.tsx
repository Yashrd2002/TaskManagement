"use client"

import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<LayoutProps> = ({ children }) => {
  
  return (
    <div className="flex md:flex-row flex-col-reverse justify-center md:items-start items-center min-h-screen md:gap-0 gap-10">
      <div className="md:w-6/12 w-full flex items-center justify-center md:h-full">
        {children} {/* This renders the page content like Signin or Signup */}
      </div>
      <div className="md:w-6/12 relative">
        <div className="flex md:flex-row flex-col md:items-start items-center md:mt-0 mt-10">
          <div className="urbanist-800 md:text-[120px] text-[50px]">
            ZEN<span className="text-[#B0EB0A]">TASK</span>
          </div>
        </div>
        <div className="absolute top-10 left-0 md:block hidden">
          <img src="/women.png" alt="Women" className="h-[670px]" />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
