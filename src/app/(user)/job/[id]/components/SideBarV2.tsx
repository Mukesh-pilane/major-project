"use client";
import { motion } from "framer-motion";
import {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import Modal from "~/components/modal/Modal";
import React from "react";
import type { IconType } from "react-icons";
import {
  BiBook,
  BiBriefcase,
  BiBuildings,
  BiHomeAlt,
  BiCloset,
  BiLink,
  BiLinkExternal,
  BiMapPin,
  BiRupee,
} from "react-icons/bi";
import { BsEmojiNeutral } from "react-icons/bs";
import { motionContainer, motionItem } from "~/utils/animation";
import type { RouterOutputs, api } from "~/utils/api";

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

const ApplyForm = ({ job }: { job: Job }) => {

  return (
    <div className=" rounded-md bg-white p-4">
    <h2 className=" text-[clamp(1rem,10vw,2rem)] font-medium capitalize">
      {job.title}
    </h2>
    <h1>sasa</h1>
    </div>
     
   
  )

}

 const SideBarV2 = ({ job }: { job: Job }) => {
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [userId, setUserId] = useState(""); // Replace with the actual user ID
  const [jobId, setJobId] = useState(""); // Replace with the actual job ID

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !userId || !jobId) {
      // Handle validation or error here
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", userId);
    formData.append("jobId", jobId);

    // try {
    //   // Call the uploadResume mutation using api.jobApplications.uploadResume
    //   const result = await api.jobApplications.uploadResume(formData);

    //   // Handle success or result here
    //   console.log("Upload successful", result);
    // } catch (error) {
    //   // Handle error here
    //   console.error("Upload failed", error);
    // }
  }
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
              <Modal
      button={
        <motion.p
        variants={motionItem}
        whileHover={{
          scale: 1.025,
        }}
        whileTap={{
          scale: 1,
        }}
        className="flex cursor-pointer items-center justify-center gap-2 rounded-md bg-accent-500 px-10 py-3 text-white"
      >
        Apply Here <BiLink size={18} />
      </motion.p>
      }
    >
      
        <ApplyForm job={job}/>
      </Modal>
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

