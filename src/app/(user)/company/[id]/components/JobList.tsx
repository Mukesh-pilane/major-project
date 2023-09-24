"use client";
import { Job } from "@prisma/client";
import { motion } from "framer-motion";
import { motionContainer } from "~/utils/animation";
import JobCard from "./JobCard";

const JobList = ({ jobs }: { jobs: Job[] }) => {
  return (
    <motion.ul
      variants={motionContainer}
      initial="hidden"
      animate="visible"
      className="grid gap-6 py-6"
    >
      {jobs.map((job) => {
        return <JobCard key={job.id} job={job} />;
      })}
    </motion.ul>
  );
};

export default JobList;
