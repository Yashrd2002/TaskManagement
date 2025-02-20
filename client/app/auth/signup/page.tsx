"use client"
import React, { useState } from "react";
import { toast } from "react-toastify";

import DynamicInput from "@/components/Input";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignUp: React.FC = () => {
  const [inputs, setInputs] = useState([
    {
      id: "name",
      label: "Full Name",
      value: "",
      isFocused: false,
      type: "text",
    },
    { id: "email", label: "Email", value: "", isFocused: false, type: "email" },
    {
      id: "password",
      label: "Password",
      value: "",
      isFocused: false,
      type: "password",
    },
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter()

  const handleChange = (
    id: string,
    value: string,
    isFocused: boolean = false
  ) => {
    setInputs((prev) =>
      prev.map((input) =>
        input.id === id ? { ...input, value, isFocused } : input
      )
    );
  };

  const handleSignUp = async () => {
    setLoading(true);

    const name = inputs[0].value;
    const email = inputs[1].value;
    const password = inputs[2].value;
    const url = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await fetch(`${url}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usernname:name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Registration successful! Redirecting to login...");
        router.push("/auth/signin"); // Redirect to sign in page after successful registration
      } else {
        toast.error(data.message); // Display error message from API response
      }
    } catch (error) {
      toast.error("An error occurred during registration.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (

      <div className="w-full flex justify-center items-center md:h-screen">
        {loading ? (
          <div className="flex justify-center items-center">
            {/* Add a loader component if required */}
            <span>Loading...</span>
          </div>
        ) : (
          <div className="flex flex-col justify-center gap-6 md:w-6/12 w-full md:px-0 px-6">
            <h2 className="urbanist-800 md:text-[32px] text-[24px] tracking-wide">
              Sign Up
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
              <Button onClick={handleSignUp} text="Sign Up" />
            </div>

            <div className="urbanist-400 text-center mt-2">
              Already have an account?{" "}
              <Link href={"/auth/signin"} className="text-[#83AEF8]">
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>

  );
};

export default SignUp;
