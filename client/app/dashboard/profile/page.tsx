"use client"
import { useEffect, useState } from "react";

import WaveLoader from "@/components/WaveLoader";
import { useRouter } from "next/navigation";

const Profile = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${url}/check-auth`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          setLoading(false);
          router.push("/");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setLoading(false);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
  console.log(user);
  
  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <WaveLoader />{" "}
        </div>
      ) : (
        <div className="p-8 urbanist-700 flex flex-col gap-2">
          <div>Email : {user?.email}</div>
          <div>Username : {user?.username}</div>
        </div>
      )}
    </div>
  );
};

export default Profile;
