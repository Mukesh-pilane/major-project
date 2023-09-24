import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import JobCard from "~/components/job/JobCard";
import JobCardSkeleton from "~/components/skeleton/JobCardSkeleton";
import { motionContainer } from "~/utils/animation";
import { api } from "~/utils/api";

const ApprovedJobList = () => {
  const { data: jobs } = api.job.adminGetApprovedJobs.useQuery();

  const skeleton = [...Array(8).keys()].map((i) => {
    return <JobCardSkeleton key={i} />;
  });

  return (
    <>
      {jobs ? (
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={motionContainer}
          className="grid h-fit gap-6"
        >
          <AnimatePresence>
            {jobs?.map((job) => {
              return <JobCard job={job} key={job.id} />;
            })}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <ul className="grid gap-6 ">{skeleton}</ul>
      )}
    </>
  );
};

export default ApprovedJobList;
