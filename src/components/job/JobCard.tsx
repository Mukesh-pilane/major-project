import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
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
import AdminJobCardControl from "~/app/(admin)/admin/components/AdminJobCardControl";
import UserJobCardControl from "~/app/(user)/profile/components/UserJobCardControl";
import TimeAgoComponent from "~/components/TimeAgo";
import { motionItem } from "~/utils/animation";
import type { RouterOutputs } from "~/utils/api";

type Job = RouterOutputs["job"]["adminGetAllJobs"][0];

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

const JobCard = ({ job }: { job: Job }) => {
  const { data: session } = useSession();
  return (
    <motion.li
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
        <div className=" col-span-2 my-2 flex flex-wrap items-center gap-y-1  gap-x-6 md:col-span-1 md:my-[revert]">
          <TextItem
            prefix="Salary"
            suffix={job.salary ? `${job.salary} lpa` : "Not Disclosed"}
            icon={BiRupee}
          />

          <TextItem
            suffix={
              job?.experienceMin && job?.experienceMax
                ? ` ${
                    job?.experienceMin === 0 ? "Fresher" : job.experienceMin
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
        <p className=" flex h-full max-h-6 w-fit  items-center rounded-full py-1 px-4 text-xs capitalize  text-gray-500 md:bottom-1 md:right-1">
          <TimeAgoComponent createdAt={job.createdAt} />
        </p>
        <p className=" ml-auto flex h-full max-h-6  rounded-full py-1 px-4 text-end text-xs capitalize  text-gray-500 md:bottom-1 md:right-1">
          by {job.company.name}
        </p>
      </div>
      {session?.user.id === job.userId && !session?.user.isAdmin && (
        <UserJobCardControl job={job} />
      )}
      {session?.user.isAdmin && <AdminJobCardControl job={job} />}
    </motion.li>
  );
};

export default JobCard;
