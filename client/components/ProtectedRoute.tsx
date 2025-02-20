import { ReactNode, useEffect, useState } from "react";

import WaveLoader from "./WaveLoader";
import { useRouter } from "next/navigation";
interface ProtectedProps {
  children: ReactNode;
}
const ProtectedRoute = ({ children }: ProtectedProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const url = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter()
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${url}/check-auth`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
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

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <WaveLoader />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
