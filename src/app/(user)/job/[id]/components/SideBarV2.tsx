"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { IconType } from "react-icons";
import {
  BiBook,
  BiBriefcase,
  BiBuildings,
  BiHomeAlt,
  BiLink,
  BiLinkExternal,
  BiMapPin,
  BiRupee,
} from "react-icons/bi";
import { BsEmojiNeutral } from "react-icons/bs";
import { motionContainer, motionItem } from "~/utils/animation";
import type { RouterOutputs } from "~/utils/api";

type Job = RouterOutputs["job"]["get"];

const InfoCard = ({
  prefix,
  suffix,
  icon: Icon,
}: {
  prefix: string;
  suffix: string;
  icon: IconType;
}) => {
  return (
    <motion.li
      variants={motionItem}
      transition={{
        type: "spring",
      }}
      className="flex items-center justify-between rounded-md bg-light-500 p-4 px-6 capitalize  backdrop-blur-md"
    >
      <div className=" flex items-center gap-2 text-sm">
        <Icon size={18} />
        {prefix}
      </div>
      <p className=" text-end text-sm capitalize">{suffix.toLowerCase()}</p>
    </motion.li>
  );
};

const SideBarV2 = ({ job }: { job: Job }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -100,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="grid h-fit grid-rows-[200px_1fr] rounded-md bg-white text-gray-900"
    >
      <div className=" grid grid-rows-[1fr_auto] justify-center rounded-b-3xl bg-light-100/30">
        <Image
          width={100}
          height={100}
          src={job.company.logo}
          alt={job.company.name}
          className="m-auto aspect-square max-w-[8rem] object-contain"
        />

        <Link
          href={`/company/${job.company.id}`}
          className=" flex items-center gap-2 py-4 text-sm underline"
          target={"_blank"}
        >
          More info and Listing
          <BiLinkExternal />
        </Link>
      </div>
      <motion.ul
        variants={motionContainer}
        initial="hidden"
        animate="visible"
        className=" flex flex-col gap-4 p-4"
      >
        <InfoCard
          prefix="Company"
          suffix={job.company.name}
          icon={BiBuildings}
        />
        <InfoCard
          prefix="Experience"
          suffix={`${job.experienceMin} - ${job.experienceMax} yr`}
          icon={BiBriefcase}
        />
        {job.salary > 0 && (
          <InfoCard
            prefix="Salary"
            suffix={`${job.salary} Lpa`}
            icon={BiRupee}
          />
        )}
        <InfoCard
          prefix="Work Place"
          suffix={job.workPlace.toLocaleLowerCase()}
          icon={
            job.workPlace === "OFFICE"
              ? BiBuildings
              : job.workPlace === "HYBRID"
              ? BsEmojiNeutral
              : BiHomeAlt
          }
        />
        {job.workPlace !== "REMOTE" && (
          <InfoCard
            prefix="Location"
            suffix={job.location.toLowerCase()}
            icon={BiMapPin}
          />
        )}
        {job.education && (
          <InfoCard
            prefix="Education"
            suffix={job.education.toLowerCase()}
            icon={BiBook}
          />
        )}
        <motion.a
          target={"_blank"}
          variants={motionItem}
          href={job?.applyUrl}
          whileHover={{
            scale: 1.025,
          }}
          whileTap={{
            scale: 1,
          }}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-md bg-accent-500 py-3 text-white"
        >
          Apply Here <BiLink size={18} />
        </motion.a>
        {job.applyEmail && (
          <motion.a
            href={`mailto:${job.applyEmail}`}
            variants={motionItem}
            whileHover={{
              scale: 1.025,
            }}
            whileTap={{
              scale: 1,
            }}
            className="flex cursor-pointer items-center justify-center gap-2 text-sm"
          >
            Any Query : {job.applyEmail}
          </motion.a>
        )}
      </motion.ul>
    </motion.div>
  );
};

export default SideBarV2;
