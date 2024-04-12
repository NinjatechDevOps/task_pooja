import React from "react";
import { useRouter } from "next/navigation";

const Header = () => {

const router = useRouter();

const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
};
  return (
    <>
      <header className="border-b-2 border-gray-200 bg-white">
        <div className="relative mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="absolute inset-y-0 right-0 flex items-center justify-end pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="flex flex-wrap items-center space-x-4 font-light sm:text-sm">
              <div className="flex items-center ">
                <a className="text-gray-800 hover:text-gray-900" href="#">
                  Help
                </a>
              </div>
              <div className="flex items-center">
                <a className="text-gray-800 hover:text-gray-900" href="#">
                  Orders & Returns
                </a>
              </div>
              <div className="flex items-center">
                <a className="text-gray-800 hover:text-gray-900" href="#">
                  Hi, Jhon
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                aria-label="Main menu"
                aria-haspopup="true"
              >
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-4 flex items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex-shrink-0">
                <a className="text-xl font-bold text-gray-800" href="#">
                  ECOMMERCE
                </a>
              </div>
              <div className="hidden sm:ml-80 sm:block">
                <div className="flex space-x-4 font-semibold">
                  <div className="flex items-center">
                    <a className="text-gray-800 hover:text-gray-900" href="#">
                      Categories
                    </a>
                  </div>
                  <div className="flex items-center">
                    <a className="text-gray-800 hover:text-gray-900" href="#">
                      Sale
                    </a>
                  </div>
                  <div className="flex items-center">
                    <a className="text-gray-800 hover:text-gray-900" href="#">
                      Clearance
                    </a>
                  </div>
                  <div className="flex items-center">
                    <a className="text-gray-800 hover:text-gray-900" href="#">
                      New stock
                    </a>
                  </div>
                  <div className="flex items-center">
                    <a className="text-gray-800 hover:text-gray-900" href="#">
                      Trending
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div className="flex ">
                <div className="flex items-center space-x-7">
                  <a className="text-gray-800 hover:text-gray-900" href="#">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </a>
                  <a className="text-gray-800 hover:text-gray-900" href="#">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </a>
                  <div className="relative">
                    <a
                        className="text-gray-800 hover:text-gray-900 cursor-pointer"
                        onClick={handleLogout}
                    >
                        logout
                    </a>
                    <span className="absolute bg-gray-800 text-white text-xs px-2 py-1 rounded-md bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 opacity-0 pointer-events-none transition-opacity duration-300">
                        Logout
                    </span>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto rounded-md bg-gray-100 px-6 py-1 text-center text-white ">
        <p className="text-md font-sans  text-black">
          {"< "}
          Get 10% off on business sign up{" >"}
        </p>
      </div>
    </>
  );
};

export default Header;
