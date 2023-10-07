"use client";
import { motion } from "framer-motion";
import { useState, useEffect} from "react";
import Image from "next/image";
import Link from "next/link";
import PrimaryButton from "~/components/button/PrimaryButton";
import Modal from "~/components/modal/Modal";
import React from "react";
import { Form, Formik } from "formik";
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
import type { RouterOutputs} from "~/utils/api";
import { toast } from "react-hot-toast";
import {api} from "~/utils/api";
import PdfUpload from "~/components/input/PdfUpload";
import { useSession } from "next-auth/react";
import axios from "axios";
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
  const { data: session } = useSession();
  const [isApplied, setIsApplied] = useState(false)
  const hasApplied = api.jobApplications.hasUserAppliedJob.useMutation({
    onSuccess: (data) => {
      if (data){
        setIsApplied(true)
      }
    },
  })

  const getresume = api.jobApplications.getResume.useMutation()

  

  const checkApplied = () =>{
    hasApplied.mutate({
      userId: session?.user.id, jobId: job?.id
    });
    
  
  }
  useEffect(() => {
    if(session){
    checkApplied();

    }
  }, [session]);

  



  
 // Call the uploadResume mutation using api.jobApplications.uploadResume
 const result= api.jobApplications.uploadResume.useMutation({
    onError: (e) => {
      toast.error(`Something went wrong ${e.message}`);
    },
    onSuccess: () => {
      toast.success(`SuccessFully applied for job`);
      setIsApplied(true);
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
    
      const reader = new FileReader();
      reader.onload = async (event) => {
        const buffer = event.target?.result as ArrayBuffer;
        const base64Data = Buffer.from(buffer).toString("base64");
    
        try {
          // Call the uploadResume mutation using trpc
          result.mutate({
            file: base64Data, // Send the file as a base64-encoded string
            userId: session.user.id,
            jobId: job.id,
            jobDescription: job.desc
          });
    
   
          console.log("Upload successful", result);
        } catch (error) {
          // Handle error here
          toast.error(`Something went wrong: ${error.message}`);
          console.error("Upload failed", error);
        }
      };
    
      reader.readAsArrayBuffer(selectedFile);
    };
    

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
              {isApplied ? "Applied" : "Apply Here"} <BiLink size={18} />
            </motion.p>
          }
          isApplied={isApplied}
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

