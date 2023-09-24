import { motion } from "framer-motion";
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
import TimeAgoComponent from "~/components/TimeAgo";
import { motionItem } from "~/utils/animation";
import type { RouterOutputs } from "~/utils/api";

type Job = RouterOutputs["job"]["create"];

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
    <li className="  flex  items-center gap-1 text-sm capitalize">
      <Icon size={16} className="text-accent-400" title={prefix ?? ""} />
      <span className="text-sm text-gray-500 line-clamp-1">{suffix}</span>
    </li>
  );
};

const JobCard = ({ job }: { job: Job }) => {
  return (
    <motion.li
      variants={motionItem}
      whileHover={{
        scale: 1.025,
      }}
      transition={{
        type: "spring",
      }}
      className=" relative grid items-center gap-2 rounded-2xl bg-white p-4 shadow-2xl shadow-accent-100/50 hover:shadow-accent-100 hover:ring-2 hover:ring-accent-200 "
    >
      <Link
        href={`/job/${job.id}`}
        className="grid   items-center gap-2  gap-x-4"
        target={"_blank"}
      >
        <h2 className="font-medium capitalize line-clamp-2 ">
          {job.title.toLowerCase()}
        </h2>
        <ul className="  my-2 flex flex-wrap items-center gap-y-1  gap-x-6  md:my-[revert]">
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
          <TextItem
            prefix="Salary"
            suffix={job.salary ? `${job.salary} lpa` : "Not Disclosed"}
            icon={BiRupee}
          />
          <TextItem
            suffix={
              job?.experienceMin !== job?.experienceMax
                ? ` ${
                    job?.experienceMin === 0 ? "Fresher" : job.experienceMin
                  } - ${job.experienceMax} yrs`
                : "Not Disclosed"
            }
            icon={BiBriefcase}
          />
          <TextItem prefix="Location" suffix={job.location} icon={BiMap} />
        </ul>
      </Link>
      <div className=" grid grid-cols-2 ">
        <p className=" flex h-full max-h-6 w-fit  items-center rounded-full py-1 px-4 text-xs capitalize  text-gray-500 md:bottom-1 md:right-1">
          <TimeAgoComponent createdAt={job.createdAt} />
        </p>
      </div>
    </motion.li>
  );
};

export default JobCard;
