"use client";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { toast } from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { FiChevronDown } from "react-icons/fi";
import SecondaryButton from "~/components/button/SecondaryButton";
import { motionContainer, motionItem } from "~/utils/animation";
import { api } from "~/utils/api";

const CategoryPage = () => {
  const ctx = api.useContext();
  const { data: categories } = api.category.getAll.useQuery();
  const createCategory = api.category.create.useMutation({
    onSuccess: () => {
      toast.success("Category Created SuccessFully");
      void ctx.category.getAll.invalidate();
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });
  const deleteCategory = api.category.delete.useMutation({
    onSuccess: () => {
      toast.success("Category Deleted SuccessFully");
      void ctx.category.getAll.invalidate();
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const { data: subCategories } = api.subCategory.getAll.useQuery();
  const createSubCategory = api.subCategory.create.useMutation({
    onSuccess: () => {
      toast.success("Sub Category Created SuccessFully");
      void ctx.subCategory.getAll.invalidate();
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });
  const deleteSubCategory = api.subCategory.delete.useMutation({
    onSuccess: () => {
      toast.success("Sub Category Deleted SuccessFully");
      void ctx.subCategory.getAll.invalidate();
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  if (!categories || !subCategories) return null;
  return (
    <main className=" mx-auto grid w-full max-w-7xl gap-6 py-10 px-6 md:grid-cols-2">
      <div>
        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const name = (
              e.currentTarget.elements.namedItem("name") as HTMLInputElement
            ).value;
            void createCategory.mutate({
              name: name,
            });
          }}
          className="flex items-center gap-4"
        >
          <input
            className={`w-full  rounded-md bg-transparent p-2 text-base font-normal text-gray-900  ring-1 ring-accent-100  placeholder:text-gray-400 focus:outline-none focus:outline-1 focus:ring-opacity-50 dark:text-gray-50 dark:ring-opacity-50`}
            type="text"
            name="name"
            id="name"
            placeholder="Category Name"
          />
          <SecondaryButton
            loading={createCategory.isLoading}
            disable={createCategory.isLoading}
            type="submit"
            className=" rounded-full  bg-white py-2  ring-1 ring-accent-100 duration-300 ease-in-out hover:ring-accent-500"
          >
            Create
          </SecondaryButton>
        </form>
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={motionContainer}
          className=" my-8 grid gap-6 "
        >
          <AnimatePresence>
            {categories.map((category) => {
              return (
                <motion.li
                  variants={motionItem}
                  key={category.id}
                  exit={{
                    scale: 0,
                    opacity: 0,
                  }}
                  className="flex justify-between gap-2 rounded-3xl bg-white p-4  px-6 capitalize shadow-2xl shadow-accent-100/50"
                >
                  <h2>{category.name}</h2>
                  <SecondaryButton
                    onClick={() => {
                      deleteCategory.mutateAsync({
                        id: category.id,
                      });
                    }}
                    loading={deleteCategory.data?.id === category.id}
                  >
                    <AiOutlineDelete className=" text-red-500" />
                  </SecondaryButton>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      </div>
      <div>
        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const name = (
              e.currentTarget.elements.namedItem("name") as HTMLInputElement
            ).value;

            const categoryId = (
              e.currentTarget.elements.namedItem("category") as HTMLInputElement
            ).value;
            void createSubCategory.mutate({
              name: name,
              categoryId: categoryId,
            });
          }}
          className="flex items-center gap-4"
        >
          <div className=" group relative w-full">
            <select
              name="category"
              id="category"
              className={` z-0 w-full rounded-md  bg-transparent p-2 text-base font-normal capitalize  text-gray-900 ring-1 ring-accent-100 transition-all  duration-300 ease-in-out  placeholder:text-gray-400 hover:cursor-pointer focus:outline-none focus:outline-1  focus:ring-opacity-50 group-hover:ring-accent-500 dark:text-gray-50 dark:ring-opacity-50`}
              required
            >
              {categories?.map((category) => {
                return (
                  <option
                    className=" capitalize"
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                );
              })}
            </select>
            <FiChevronDown
              size={24}
              className="  absolute inset-y-0 right-1 z-50 my-auto  text-accent-200 transition-all duration-300 ease-in-out group-hover:text-accent-500"
            />
          </div>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Sub Category Name"
            className={`w-full  rounded-md bg-transparent p-2 text-base font-normal text-gray-900  ring-1 ring-accent-100  placeholder:text-gray-400 focus:outline-none focus:outline-1 focus:ring-opacity-50 dark:text-gray-50 dark:ring-opacity-50`}
          />
          <SecondaryButton
            loading={createSubCategory.isLoading}
            disable={createSubCategory.isLoading}
            type="submit"
            className=" rounded-full  bg-white py-2  ring-1 ring-accent-100 duration-300 ease-in-out hover:ring-accent-500"
          >
            Create
          </SecondaryButton>
        </form>

        <motion.ul
          initial="hidden"
          animate="visible"
          exit={{
            scale: 0,
            opacity: 0,
          }}
          variants={motionContainer}
          className=" my-8 grid gap-6 "
        >
          <AnimatePresence>
            {subCategories.map((category) => {
              return (
                <motion.li
                  variants={motionItem}
                  key={category.id}
                  exit={{
                    scale: 0,
                    opacity: 0,
                  }}
                  className="flex justify-between gap-2 rounded-3xl bg-white p-4  px-6 capitalize shadow-xl shadow-accent-100/20"
                >
                  <h2>
                    {category.name} - {category?.category?.name}
                  </h2>
                  <SecondaryButton
                    onClick={() => {
                      deleteSubCategory.mutateAsync({
                        id: category.id,
                      });
                    }}
                    loading={deleteSubCategory.data?.id === category.id}
                  >
                    <AiOutlineDelete className=" text-red-500" />
                  </SecondaryButton>
                </motion.li>
              );
            })}{" "}
          </AnimatePresence>
        </motion.ul>
      </div>
    </main>
  );
};

export default CategoryPage;
