import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import type { FormEvent } from "react";

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const createUser = api.user.create.useMutation({
    onSuccess: (data) => {
      router.push(`/verification?uuid=${data.uuid}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleLoginClick = () => {
    router.push("/login");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    createUser.mutate({ name, password, email });
  };

  return (
    <div className="mt-16 flex h-screen items-start justify-center bg-white">
      <div className="w-full max-w-xl rounded-xl border bg-white p-10 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Create your account
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="mb-3">
            <label htmlFor="name" className="mb-1 block">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter"
              value={name}
              id="name"
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border p-2"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="mb-1 block">
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
            <label htmlFor="password" className="mb-1 block">
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
                style={{ top: "50%", transform: "translateY(-50%)" }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="mb-6 block w-full rounded-md bg-black p-2 text-white"
          >
            CREATE ACCOUNT
          </button>
        </form>
        <hr />
        <div className="mt-4 text-center">
          <p>
            Have an Account?{" "}
            <button
              type="button"
              onClick={handleLoginClick}
              className="cursor-pointer border-none bg-transparent font-bold text-black"
            >
              LOGIN
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
