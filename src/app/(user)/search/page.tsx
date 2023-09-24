"use client";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import SecondaryButton from "~/components/button/SecondaryButton";
import SearchInput from "~/components/input/SearchInput";
import JobCard from "~/components/job/JobCard";
import ComboBox from "~/components/select/ComboBox";
import JobCardSkeleton from "~/components/skeleton/JobCardSkeleton";
import { motionContainer } from "~/utils/animation";
import { api } from "~/utils/api";

type option = {
  value: string;
  category?: string;
  title: string;
};

const SearchPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [jobs, setJobs] = useState<any>([]);

  const paramCategory = searchParams.get("category");
  const paramSubCategory = searchParams.get("subCategory");
  const paramPage = searchParams.get("page");
  const paramSearch = searchParams.get("search");

  const [selectedCategory, setSelectedCategory] = useState<option>(
    paramCategory
      ? {
          title: paramCategory,
          value: "",
        }
      : undefined
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState<option>(
    paramSubCategory
      ? {
          title: paramSubCategory,
          value: "",
        }
      : undefined
  );
  const [page, setPage] = useState(paramPage ? parseInt(paramPage) : 1);
  const [search, setSearch] = useState(paramSearch ?? "");
  const [hasMore, setHasMore] = useState(false);

  const { data: categories } = api.category.getAll.useQuery();
  const { data: subCategories } = api.subCategory.getAll.useQuery();

  const getJobs = api.job.search.useMutation();

  const fetchJobs = async () => {
    const skip = jobs?.length * (page - 1) || 0;
    const newData = await getJobs.mutateAsync({
      skip: skip,
      category: selectedCategory ? selectedCategory.title : "",
      subCategory: selectedSubCategory ? selectedSubCategory.title : "",
      searchTerm: search,
    });
    setJobs(newData.jobs);
    setHasMore(newData.hasMore);
  };

  const categoriesOptions: option[] = useMemo(() => {
    return categories?.map((category) => {
      return {
        title: category.name,
        value: category.id,
      };
    });
  }, [categories]);

  const subCategoriesOptions: option[] = useMemo(() => {
    return selectedCategory
      ? subCategories
          ?.filter(
            (category) => category.category.id === selectedCategory.value
          )
          .map((category) => {
            return {
              value: category.id,
              title: category.name,
              category: category.category.id,
            };
          })
      : subCategories?.map((category) => {
          return {
            value: category.id,
            title: category.name,
          };
        });
  }, [selectedCategory, subCategories]);

  useEffect(() => {
    const searchParams = new URLSearchParams();
    if (selectedCategory) {
      searchParams.append("category", selectedCategory.title);
    }
    if (selectedSubCategory) {
      searchParams.append("subCategory", selectedSubCategory.title);
    }
    if (page) {
      searchParams.append("page", page.toString());
    }
    if (search) {
      searchParams.append("search", search);
    }
    router.push(`/search?${searchParams}`);
    fetchJobs();
  }, [selectedCategory, selectedSubCategory, page, search]);

  const skeleton = [...Array(5).keys()].map((i) => {
    return <JobCardSkeleton key={i} />;
  });

  return (
    <main className=" mx-auto grid h-full w-full max-w-7xl gap-6 px-4 pb-16 md:grid-cols-[auto_1fr] md:py-10 ">
      <div className=" top-11 z-10 grid h-fit gap-6 bg-light-500 md:sticky  md:max-w-[250px]">
        <SearchInput value={search} onChange={setSearch} />
        {categories && (
          <ComboBox
            title="Category"
            options={categoriesOptions}
            onChange={setSelectedCategory}
            selected={selectedCategory}
          />
        )}
        {subCategories && (
          <ComboBox
            title="Sub Category"
            options={subCategoriesOptions}
            onChange={setSelectedSubCategory}
            selected={selectedSubCategory}
          />
        )}
      </div>
      <div className=" z-10">
        <>
          {jobs && !getJobs.isLoading ? (
            <motion.ul
              initial="hidden"
              animate="visible"
              variants={motionContainer}
              className="grid gap-6 "
            >
              {jobs?.map((job) => {
                return <JobCard job={job} key={job.id} />;
              })}
            </motion.ul>
          ) : (
            <>
              <ul className="grid gap-6 ">{skeleton}</ul>
            </>
          )}
          {jobs.length === 0 && !getJobs.isLoading && (
            <div className="flex h-full items-center justify-center text-center">
              No jobs found
            </div>
          )}
          <div className=" my-6 flex justify-between">
            {page > 1 && (
              <SecondaryButton
                onClick={() => setPage((prev) => prev - 1)}
                className=" relative mr-auto  w-fit rounded-full bg-dark-500 py-2 text-white shadow-2xl shadow-dark-500/50"
                disable={getJobs.isLoading}
              >
                Prev
              </SecondaryButton>
            )}
            {hasMore && (
              <SecondaryButton
                onClick={() => setPage((prev) => prev + 1)}
                className=" relative ml-auto  w-fit rounded-full bg-dark-500 py-2 text-white shadow-2xl shadow-dark-500/50"
                disable={getJobs.isLoading}
              >
                Next
              </SecondaryButton>
            )}
          </div>
        </>
      </div>
    </main>
  );
};

export default SearchPage;
