"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PrimaryButton from "~/components/button/PrimaryButton";
import Modal from "~/components/modal/Modal";
import React from "react";
import { Field, Form, Formik } from "formik";
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
import type { RouterOutputs} from "~/utils/api";
import { toast } from "react-hot-toast";
import {api} from "~/utils/api";
import PdfUpload from "~/components/input/PdfUpload";
import { useSession } from "next-auth/react";

type Job = RouterOutputs["job"]["get"];
type UploadResumeResult = RouterOutputs["jobApplications"]["uploadResume"];

type UploadResumeArgs = {
  file?: Buffer;
  userId?: string;
  jobId?: string;
};

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

  const [selectedFile, setSelectedFile] = useState(null);
  const [xyzBuffer, setXyzBuffer] = useState(null);
  const { data: session } = useSession();

 // Call the uploadResume mutation using api.jobApplications.uploadResume
 const result= api.jobApplications.uploadResume.useMutation({
    onError: (e) => {
      toast.error(`Something went wrong ${e.message}`);
    },
    onSuccess: () => {
      toast.success(`SuccessFully applied for job`);
    },
  });
  const handlePdfChange = (file: File) => {
    setSelectedFile(file);
    
    };
  const handleUpload = async () => {

    if (!selectedFile || !session.user.id || !job.id) {
      // Handle validation or error here
      return;
    }


    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", session.user.id);
    formData.append("jobId", job.id);

    const reader = new FileReader();
    reader.onload = (event) => {
      const buffer = event.target?.result as ArrayBuffer;
      
setXyzBuffer(buffer);
console.log(xyzBuffer);

    };
      reader.readAsArrayBuffer(selectedFile);
    try {

      const args: UploadResumeArgs = {
        file: selectedFile as Buffer, // The selected file to upload (a Buffer or a file object)
        userId: "12345", // Replace with the actual user ID
        jobId: "67890", // Replace with the actual job ID
      };
      
      void result.mutate({file: xyzBuffer,userId:session.user.id,jobId:job.id})

      // Handle success or result here
      console.log("Upload successful");
    } catch (error) {
      // Handle error here
      console.error("Upload failed", error);
    }
  }

  const ApplyForm = ({ job }: { job: Job }) => {

    return (
      <>
  
        <div className=" rounded-md bg-white  p-4">
          <h2 className=" text-[clamp(1rem,10vw,1.3rem)] font-medium capitalize">
            Applying for {job.title}
          </h2>
          <h1>{job.company.name}</h1>
        </div>
        <Formik
          initialValues={{
            name: "",
            website: "",
            linkedin: "",
          }}
          onSubmit={() => {
        handleUpload();
            }
          }
        >
  
  <Form className=" grid gap-4">
            <PdfUpload onPdfChange={handlePdfChange} seleltedFile={selectedFile}/>
            <PrimaryButton
            className="mt-4"
            type="submit"
          >
            Submit
          </PrimaryButton>
            </Form>
        </Formik>
  
      </>
    )
  
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

          <ApplyForm job={job} />
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

