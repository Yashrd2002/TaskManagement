import Link from "next/link";

const Home = () => {
  return (
    <div className="flex md:flex-row flex-col-reverse justify-center md:items-start items-center min-h-screen md:gap-0 gap-10">
      <div className="md:w-6/12 w-full flex items-center justify-center md:h-full">
        <div className="w-full flex justify-center items-center md:h-screen">
          <div className="flex flex-col justify-center gap-6 md:w-5/12 w-full md:px-0 px-6">
            <div className="urbanist-700 text-center text-[40px]">
              {" "}
              Welcome To Zentask!
            </div>
            <div className="flex justify-center">
              <Link
                href="/auth/signin"
                className="bg-[#B0EB0A] hover:bg-[#afeb0ac4] text-black rounded-xl py-1 px-10 urbanist-800 text-[24px]"
              >
                Sign In
              </Link>
            </div>
            <div className="w-full flex items-center gap-4 px-4">
              <div className="w-full h-[1px] border border-[#c4c4c4]"></div>
              <div className="urbanist-700">OR</div>
              <div className="w-full h-[1px] border border-[#c4c4c4]"></div>
            </div>
            <div className="flex justify-center">
              <Link
                href="/auth/signup"
                className="bg-[#B0EB0A] hover:bg-[#afeb0ac4] text-black rounded-xl py-1 px-10 urbanist-800 text-[24px]"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
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

export default Home;
