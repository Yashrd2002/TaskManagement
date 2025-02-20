"use client"
import React, { useState } from "react";
import { toast } from "react-toastify";

import DynamicInput from "@/components/Input";
import Button from "@/components/Button";
import WaveLoader from "@/components/WaveLoader";
import { useRouter } from "next/navigation";
import Link from "next/link";


interface Input {
  id: string;
  label: string;
  value: string;
  isFocused: boolean;
  type: string;
}

const SignIn: React.FC = () => {
  const [inputs, setInputs] = useState<Input[]>([
    {
      id: "email",
      label: "Email",
      value: "yash@gmail.com",
      isFocused: false,
      type: "email",
    },
    {
      id: "password",
      label: "Password",
      value: "123456",
      isFocused: false,
      type: "password",
    },
  ]);

  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false);


  const handleChange = (
    id: string,
    value: string,
    isFocused: boolean = false
  ) => {
    setInputs((prev) =>
      prev.map((input) =>
        input.id === id
          ? { ...input, value, isFocused: isFocused ?? input.isFocused }
          : input
      )
    );
  };

  const handleSignIn = async () => {

    setLoading(true);

    const email = inputs[0].value;
    const password = inputs[1].value;

    const url = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${url}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to a dashboard or home page after successful login
        router.push("/dashboard/analysis");
      } else {
        toast.error(data.message); // Display error message from API response
      }
    } catch (error) {
      toast.error("An error occurred.");
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false once the request completes
    }
  };

  return (

      <div className="w-full flex justify-center items-center md:h-screen">
        {loading ? (
          <div className="flex justify-center items-center">
            <WaveLoader />
          </div>
        ) : (
          <div className="flex flex-col justify-center gap-6 md:w-6/12 w-full md:px-0 px-6">
            <h2 className="urbanist-800 md:text-[32px] text-[24px] tracking-wide">
              Sign In{" "}
            </h2>

            <div className="w-full flex flex-col gap-3">
              {inputs.map((input) => (
                <DynamicInput
                  key={input.id}
                  id={input.id}
                  label={input.label}
                  value={input.value}
                  isFocused={input.isFocused}
                  onChange={handleChange}
                  type={input.type}
                />
              ))}
            </div>

            <div className="flex justify-center px-10 mt-2">
              <Button onClick={handleSignIn} text="Sign In" />
            </div>

            <div className="urbanist-400 text-center mt-2">
              Do not have an account ?{" "}
              <Link href={"/auth/signup"} className="text-[#83AEF8]">
                {" "}
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>

  );
};

export default SignIn;
