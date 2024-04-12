"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getServerSideProps() {
  const categories = await prisma.category.findMany();
  const userCategory = await prisma.userCategory.findMany();
  const formattedCats = categories.map((cat) => ({
    ...cat,
    createdAt: cat.createdAt.toString(),
    updatedAt: cat.updatedAt.toString(),
  }));

  const userCat = userCategory.map((item) => ({
    ...item,
    createdAt: item.createdAt.toString(),
    updatedAt: item.updatedAt.toString(),
  }));
  return {
    props: {
      categories: formattedCats,
      userCategories: userCat,
    },
  };
}

interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface UserCategory {
  id: number;
  userId: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

export default function Dashboard({
  categories,
  userCategories,
}: {
  categories: Category[];
  userCategories: UserCategory[];
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token === "undefined" ?? !token) {
      router.push("/login");
    }
  }, [router]);

  // Uncomment the code to insert categories // 
  //  const countOfCategoriesToInsert = 100;
  //   const createCategory = api.category.insertCategories.useMutation({
  //     onSuccess: (data) => {
  //     },
  //     onError: (error) => {
  //       toast.error(error.message);
  //     },
  //   });

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNames, setSelectedNames] = useState<number[]>([]);
  const catPerPage = 6;

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    const userId = uid ? parseInt(uid, 10) : 0;
    const userCategoriesForUser = userCategories.filter(
      (category) => category.userId === userId,
    );
    const selectedIds = userCategoriesForUser.map(
      (category) => category.categoryId,
    );
    setSelectedNames(selectedIds);
  }, [userCategories]);

  const indexOfLastPost = currentPage * catPerPage;
  const indexOfFirstPost = indexOfLastPost - catPerPage;
  const currentCats: Category[] = categories.slice(
    indexOfFirstPost,
    indexOfLastPost,
  );

  const totalPageNumbers = Math.ceil(categories.length / catPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleBackward = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleForward = () => {
    if (currentPage < totalPageNumbers) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPageNumbers; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers.map((number) => {
      if (
        number === currentPage ||
        number === currentPage - 1 ||
        number === currentPage + 1
      ) {
        return (
          <li
            key={number}
            onClick={() => handlePageChange(number)}
            style={{
              cursor: "pointer",
              display: "inline",
              marginRight: "10px",
              fontWeight: currentPage === number ? "bold" : "normal",
            }}
          >
            {number}
          </li>
        );
      }
      return null;
    });
  };

  const createUserCategory = api.userCategory.insertUserCategory.useMutation({
    onSuccess: (data: { userCategories: { id: number }[] }) => {
      const newArray: number[] = [];
      data.userCategories.forEach((category: { id: number }) => {
        newArray.push(category.id);
      });
    },
    onError: (error: { message: string }) => {
      toast.error(error.message);
    },
  });

  const handleCheckboxChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { id, checked } = event.target;
    const token = localStorage.getItem("access_token") ?? "";
    if (checked) {
      try {
        if (!token) {
          throw new Error("Access token not found");
        }
        const catID = Number(id);
        createUserCategory.mutate({ id: catID, token });
        setSelectedNames((prevNames) => [...prevNames, catID]);
      } catch (error) {
        console.error("Error saving ID to database:", error);
      }
    } else {
      const newArr: number[] = [];
      for (const name of selectedNames) {
        const idNumber = parseInt(id, 10);
        if (name !== idNumber) {
          newArr.push(name);
        } else {
          const catID = Number(id);
          createUserCategory.mutate({ id: catID, token });
          newArr.push(catID);
        }
      }
      setSelectedNames(newArr);
    }
  };

  return (
    <div className="mt-16 flex h-screen items-start justify-center bg-white">
      <div className="w-full max-w-xl rounded-xl border bg-white p-10 shadow-lg">
        <h1 className="mb-3 text-center text-3xl font-bold">
          Please mark your interest!
        </h1>
        <h4 className="mb-3  text-center text-xl">We will keep you notified</h4>

        {/* Uncomment the code to insert categories */}

        {/* <button
          onClick={(e) => {
            e.preventDefault();
            createCategory.mutate({ count: countOfCategoriesToInsert });
          }}
          className="mb-6 block w-full rounded-md bg-black p-2 text-white"
        >
          Insert category
        </button> */}
        <div>
          <h1 className="mb-3 text-xl font-bold">My saved interests!</h1>
          {currentCats.map((cat: Category) => (
            <div key={cat.id} style={{ marginBottom: "10px" }}>
              <input
                type="checkbox"
                id={cat.id.toString()}
                name={cat.name}
                checked={selectedNames.includes(Number(cat.id))}
                onChange={handleCheckboxChange}
              />
              <label
                htmlFor={cat.id.toString()}
                style={{ fontSize: "1.2rem", marginLeft: "5px" }}
              >
                {cat.name}
              </label>
            </div>
          ))}
          <ul style={{ listStyle: "none", paddingLeft: "0" }}>
            <li
              onClick={handleBackward}
              style={{
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                display: "inline",
                marginRight: "10px",
                color: currentPage === 1 ? "#ccc" : "inherit",
              }}
            >
              &laquo;
            </li>
            {renderPageNumbers()}
            <li
              onClick={handleForward}
              style={{
                cursor:
                  currentPage === totalPageNumbers ? "not-allowed" : "pointer",
                display: "inline",
                marginRight: "10px",
                color: currentPage === totalPageNumbers ? "#ccc" : "inherit",
              }}
            >
              &raquo;
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
