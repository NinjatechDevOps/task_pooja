import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";
import { toast } from "react-toastify";

export default function Verification() {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState<string>("");
  const _uuid = router?.query?.uuid;

  const verifyUser = api.user.verify.useMutation({
    onSuccess: (_data) => {
      router.push(`/login`).catch((error) => {
        console.error("Router push error:", error);
      });
    },
    onError: (error: { message: string }) => {
      toast.error(error.message);
    },
  });

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    setVerificationCode((prev) => {
      const updatedCode = prev.split("");
      updatedCode[index] = value;
      return updatedCode.join("");
    });
  };

  return (
    <div className="flex justify-center h-screen bg-white items-start mt-12">
      <div className="bg-white shadow-lg  p-10 w-full max-w-md border rounded-xl">
        <h1 className="text-3xl font-bold text-center mb-6">Verify Your Email</h1>
        <div className="text-sm font-semibold text-center mb-10">
          <p>Enter 8 digit code you have received on</p>
          <p>anu***@gmail.com</p>
        </div>
        <form 
           onSubmit={async (e) => {
            e.preventDefault();
            if (typeof _uuid == 'string' && typeof verificationCode === 'string') {
             void verifyUser.mutate({ uuid: _uuid, verificationCode })
            }
          }}
          className="max-w-md mx-auto"
        >
          <div className="mb-6">
            <label htmlFor="otp" className="block text-black font-extralight mb-2">
              Code
            </label>
            <div className="flex justify-between ">
            {Array(8).fill(undefined).map((_, index) => (
              <input
                key={index}
                type="text"
                id={`otp${index}`}
                name={`otp${index}`}
                maxLength={1}
                value={verificationCode[index] ?? ""}
                onChange={(e) => handleCodeChange(e, index)}
                className="appearance-none border rounded w-10 h-10 text-center text-gray-700 leading-tight focus:outline-none focus:shadow-outline space-y-1"
                autoFocus={index === 0}
              />
            ))}
            </div>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="bg-black w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
