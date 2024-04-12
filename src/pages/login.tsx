import { useRouter } from "next/navigation";
import { useEffect, useState  } from "react";
import type { FormEvent } from "react";
import { toast } from "react-toastify";
import { api } from "~/utils/api";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  // const loginUser = api.user.login.useMutation({
  //   onSuccess: (data) => {
  //     const uid: any = data.id;
  //     localStorage.setItem("access_token", data.token);
  //     localStorage.setItem("uid", uid);
  //     router.push("/dashboard");
  //   },
  //   onError: (error) => {
  //     toast.error(error.message);
  //     console.error("Verification failed:", error);
  //   },
  // });

  const loginUser = api.user.login.useMutation({
    onSuccess: (data: { token: string; id: number }) => {
      const uid: string = data.id.toString(); 
      localStorage.setItem("access_token", data.token);
      localStorage.setItem("uid", uid);
      router.push("/dashboard");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message);
      console.error("Verification failed:", error);
    },
  });

  const handleClick = () => {
    router.push("/Signup");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter email and password");
      return;
    }
    loginUser.mutate({ password, email });
  };

  return (
    <div className="mt-16 flex h-screen items-start justify-center bg-white">
      <div className="w-full max-w-xl rounded-xl border bg-white p-10 shadow-lg">
        <h1 className="mb-3 text-center text-2xl font-bold">Login</h1>
        <h4 className="mb-3 text-center text-2xl font-bold">
          Welcome back to ECOMMERCE
        </h4>
        <h6 className=" mb-6 text-center">The next gen business marketPlace</h6>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="mb-3">
            <label htmlFor="email" className="mb-2 block">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border p-2"
            />
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="mb-2 block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border p-2"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center px-3 py-2"
                style={{ top: "50%", transform: "translateY(-50%)" }} // Center button vertically
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="mb-6 block w-full rounded-md bg-black p-2 text-white"
          >
            LOGIN
          </button>
        </form>
        <hr />
        <div className="mt-4 text-center">
          <p>
            Don&apos;t have an Account?{" "}
            <button
              type="button"
              onClick={handleClick}
              className="cursor-pointer border-none bg-transparent font-bold text-black"
            >
              SIGN UP
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
