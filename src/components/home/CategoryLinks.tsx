import Link from "next/link";
import React, { useEffect, useState } from "react";
import { prisma } from "~/server/db";
import { ClientOnly } from "@apollo/client/react/ssr"
export const revalidate = 60 * 60 * 24;

const LinkItem = ({ href, title }: { href: string; title: string }) => {
  return (
    <Link
      href={href}
      className=" relative flex w-fit flex-nowrap items-center gap-2 whitespace-nowrap rounded-3xl bg-white  py-2.5 px-4 text-center text-sm shadow-xl shadow-accent-100/50  transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-accent-200/50  hover:ring-2 hover:ring-accent-200"
      target={"_blank"}
    >
      {title}
    </Link>
  );
};

const CategoryLinks = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await prisma.category.findMany();
        setCategories(response);
      } catch (error) {
        // Handle any errors here
        console.error("Error fetching categories:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ul className="grid w-full  grid-flow-col  gap-6 overflow-auto p-4 py-8">
      <LinkItem href={"/search"} title="All Jobs" />
      {categories?.map((category) => {
        return (
        <ClientOnly>
          <LinkItem
            key={category.id}
            href={`/search?category=${category.name}`}
            title={category.name}
          />
</ClientOnly>

        );
      })}
    </ul>
  );
};

export default CategoryLinks;
