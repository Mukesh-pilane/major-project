"use client";
import { motion } from "framer-motion";
import React, { useState } from "react";
import {
  BiBriefcase,
  BiBuildings,
  BiHomeAlt,
  BiMap,
  BiRupee,
  BiSearch,
  BiTimeFive,
  BiX,
} from "react-icons/bi";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import { motionContainer, motionItem } from "~/utils/animation";
import Image from "next/image";
import Link from "next/link";
import TimeAgoComponent from "../TimeAgo";
import SecondaryButton from "../button/SecondaryButton";
import { toast } from "react-hot-toast";
import IconText from "../job/IconText";

type Job = RouterOutputs["job"]["adminGetAllJobs"][0];

const Search = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchedJobs, setSearchedJobs] = useState<Job[]>();

  const searchJob = api.job.getSearch.useMutation({
    onSuccess: (data) => {
      if (data.length) setSearchedJobs(data);
      else {
        toast.error("No Job with input found");
      }
    },
  });

  const handleSearch = async () => {
    if (searchInput)
      searchJob.mutate({
        searchTerm: searchInput,
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className=" relative mx-auto mt-10 mb-6  flex w-full max-w-2xl items-center justify-center rounded-full bg-white p-2 shadow-2xl shadow-accent-100 "
    >
      <input
        type="text"
        value={searchInput}
        className=" h-full w-full  bg-transparent py-2 pl-10 text-xl placeholder:text-sm focus:outline-none"
        placeholder="Search jobs by title or company name"
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <BiSearch
        size={24}
        className=" absolute inset-y-0 left-4 h-full  text-dark-500"
      />
      <div className=" relative">
        <SecondaryButton
          loading={searchJob.isLoading}
          disable={searchJob.isLoading}
          onClick={() => handleSearch()}
          className=" mr-1 h-full w-fit rounded-full  bg-darkGradient py-2  px-4 text-sm text-white"
        >
          Search
        </SecondaryButton>

        {searchInput && (
          <BiX
            size={24}
            title="Clean the search"
            onClick={() => {
              setSearchInput("");
              setSearchedJobs([]);
            }}
            className=" absolute inset-y-0 -left-7 h-full cursor-pointer text-dark-500 transition-all  duration-200 ease-in-out  hover:scale-110"
          />
        )}
      </div>
      {searchedJobs?.length > 0 && searchInput ? (
        <div>
          <SearchDropDown searchedJobs={searchedJobs} />
        </div>
      ) : null}
    </motion.div>
  );
};

export default Search;

const SearchDropDown = ({ searchedJobs }: { searchedJobs: Job[] }) => {
  return (
    <motion.ul
      initial="hidden"
      animate="visible"
      variants={motionContainer}
      className=" absolute left-0 top-20 z-50 grid max-h-[500px] w-full gap-4 overflow-scroll rounded-3xl
     bg-white p-4 shadow-2xl shadow-accent-200 "
    >
      {searchedJobs?.map((job: Job) => {
        return (
          <motion.li
            key={job.id}
            variants={motionItem}
            whileHover={{
              scale: 1.025,
            }}
            transition={{
              type: "spring",
            }}
            className={`relative z-10 grid items-center gap-2 rounded-2xl bg-white p-4 shadow-2xl shadow-accent-100/50 hover:shadow-accent-100 hover:ring-2 hover:ring-accent-200 ${
              job.featured ? "ring-2 ring-accent-200" : ""
            }`}
          >
            <Link
              href={`/job/${job.id}`}
              className="grid  grid-cols-[auto_1fr] grid-rows-[3,auto] items-center gap-2  gap-x-4"
              target={"_blank"}
            >
              <Image
                width={80}
                height={80}
                src={job.company.logo}
                alt={job.company.name}
                className=" row-span-2 aspect-square h-full  max-h-10 overflow-hidden object-contain md:row-span-3 md:max-h-16"
              />

              <h2 className="font-medium capitalize line-clamp-2 ">
                {job.title.toLowerCase()}
              </h2>

              <div className=" col-span-1 flex flex-wrap items-center gap-2  md:col-span-1">
                <IconText
                  prefix="job type "
                  suffix={job.type.replaceAll("_", " ").toLowerCase()}
                  icon={BiTimeFive}
                />
                <IconText
                  prefix="Work Place"
                  suffix={job.workPlace.toLocaleLowerCase()}
                  icon={
                    job.workPlace === "OFFICE"
                      ? BiBuildings
                      : job.workPlace === "HYBRID"
                      ? BiBuildings
                      : BiHomeAlt
                  }
                />
              </div>
              <ul className=" col-span-2 my-2 flex flex-wrap items-center gap-y-1  gap-x-6 md:col-span-1 md:my-[revert]">
                <IconText
                  prefix="Salary"
                  suffix={job.salary ? `${job.salary} lpa` : "Not Disclosed"}
                  icon={BiRupee}
                />
                <IconText
                  suffix={
                    job?.experienceMin !== job?.experienceMax
                      ? ` ${
                          job?.experienceMin === 0
                            ? "Fresher"
                            : job.experienceMin
                        } - ${job.experienceMax} yrs`
                      : "Not Disclosed"
                  }
                  icon={BiBriefcase}
                />
                <IconText
                  prefix="Location"
                  suffix={job.location}
                  icon={BiMap}
                />
              </ul>
            </Link>
            <div className=" grid grid-cols-2 ">
              <p className=" flex h-full max-h-6 w-fit  items-center rounded-full py-1 px-4 text-xs capitalize  text-gray-500 md:bottom-1 md:right-1">
                <TimeAgoComponent createdAt={job.createdAt} />
              </p>
              <p className=" ml-auto flex h-full max-h-6  rounded-full py-1 px-4 text-end text-xs capitalize  text-gray-500 md:bottom-1 md:right-1">
                by {job.company.name}
              </p>
            </div>
          </motion.li>
        );
      })}
    </motion.ul>
  );
};
