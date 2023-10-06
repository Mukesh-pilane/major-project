import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import TimeAgoComponent from "~/components/TimeAgo";
import { motionItem } from "~/utils/animation";
import Link from "next/link";
import type { IconType } from "react-icons";
import {
  BiBriefcase,
  BiBuildings,
  BiHomeAlt,
  BiMap,
  BiRupee,
  BiTimeFive,
} from "react-icons/bi";

import SecondaryButton from "~/components/button/SecondaryButton";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import { motion } from "framer-motion";

type Job = RouterOutputs["jobApplications"]["dummy"]; // type for each appliedjob or jobs state variable
// type Job = 


const TextItem = ({
  prefix,
  suffix,
  icon: Icon,
}: {
  prefix?: string;
  suffix: string | number;
  icon: IconType;
}) => {
  return (
    <div className="  flex  items-center gap-1 text-sm capitalize">
      <Icon size={16} className="text-accent-400" title={prefix ?? ""} />
      <span className="text-sm text-gray-500 line-clamp-1">{suffix}</span>
    </div>
  );
};

const AppliedJobscard = ({ job, createdAt }) => {

  return (
    <motion.li
      variants={motionItem}
      whileHover={{
        scale: 1.025,
      }}
      transition={{
        type: "spring",
      }}
      className={`relative z-10 grid items-center gap-2 rounded-2xl bg-white p-4 shadow-2xl shadow-accent-100/50 hover:shadow-accent-100 hover:ring-2 hover:ring-accent-200 ${job.featured ? "ring-2 ring-accent-200" : ""
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

     

        <div className=" flex justify-between flex-wrap items-end gap-2 ">
        <h2 className="font-medium capitalize line-clamp-2 ">
          {job.title.toLowerCase()}
        </h2>
        <div className="flex justify-between flex-wrap items-end gap-2">
          <TextItem
            prefix="job type "
            suffix={job.type.replaceAll("_", " ").toLowerCase()}
            icon={BiTimeFive}
          />
          <TextItem
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
        </div>
        <div className=" col-span-2 my-2 flex flex-wrap items-center gap-y-1  gap-x-6 md:col-span-1 md:my-[revert]">
          <TextItem
            prefix="Salary"
            suffix={job.salary ? `${job.salary} lpa` : "Not Disclosed"}
            icon={BiRupee}
          />

          <TextItem
            suffix={
              job?.experienceMin && job?.experienceMax
                ? ` ${job?.experienceMin === 0 ? "Fresher" : job.experienceMin
                } - ${job.experienceMax} yrs`
                : job?.experienceMin && !job?.experienceMax
                  ? ` ${job?.experienceMin} yr+`
                  : "Not Disclosed"
            }
            icon={BiBriefcase}
          />
          {job?.location && (
            <TextItem prefix="Location" suffix={job.location} icon={BiMap} />
          )}
        </div>
      </Link>
      <div className=" grid grid-cols-2 ">
        <p className=" flex h-full gap-3 max-h-9 w-fit  items-center rounded-full py-1 px-4 text-xs capitalize  text-gray-500 md:bottom-1 md:right-1">
        <p className=" ml-auto flex bg-purple-600 text-white h-full max-h-8  rounded-full py-1 px-4 text-end text-xs capitalize  text-gray-500 md:bottom-1 md:right-1">
          Applied
        </p>
          <TimeAgoComponent createdAt={createdAt} />
        </p>
        <p className=" ml-auto flex h-full max-h-6  rounded-full py-1 px-4 text-end text-xs capitalize  text-gray-500 md:bottom-1 md:right-1">
          by {job.company.name}
        </p>
       
      </div>


    </motion.li>
  );
};

const AppliedJobs = () => {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState<Job[]>();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const getUserJobApplications = api.jobApplications.getUserJobApplications.useMutation();


    const fetchUserJobs = async () => {
      if (session?.user.id) {
        const skip = jobs?.length * (page - 1) || 0;
        const data = await getUserJobApplications.mutateAsync({
          skip: skip,
          userId: session?.user.id,
        });
        setJobs(data.appliedJobs);
        console.log(jobs)
        setHasMore(data.hasMore);
      }
    };

    useEffect(() => {
      fetchUserJobs();
    }, [session, page]);

  return (
    <>
    <div className="flex w-full items-start justify-center gap-6">

      {jobs?.length > 0 ? (
        <ul className="w-full grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-1">
          {jobs?.map((job) => (
            <AppliedJobscard key={job.job.id} job={job.job} createdAt={job.createdAt} />
          ))}
        </ul>
      ) : (
        <h1>No jobs applied</h1>
      )}
        

    </div>
    <div className=" my-6 flex justify-between">
        {page > 1 && (
          <SecondaryButton
            onClick={() => setPage((prev) => prev - 1)}
            className=" relative mr-auto  w-fit rounded-full bg-dark-500 py-2 text-white shadow-2xl shadow-dark-500/50"
            disable={getUserJobApplications.isLoading}
          >
            Prev
          </SecondaryButton>
        )}
        {hasMore && (
          <SecondaryButton
            onClick={() => setPage((prev) => prev + 1)}
            className=" relative ml-auto  w-fit rounded-full bg-dark-500 py-2 text-white shadow-2xl shadow-dark-500/50"
            disable={getUserJobApplications.isLoading}
          >
            Next
          </SecondaryButton>
        )}
      </div>
    </>
  );
};

export default AppliedJobs;


