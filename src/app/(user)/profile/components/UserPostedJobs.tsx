"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import JobCard from "~/components/job/JobCard";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import SecondaryButton from "~/components/button/SecondaryButton";
type Job = RouterOutputs["job"]["get"];
const UserPostedJobs = () => {
  const { data: session } = useSession();
  const getUserJobs = api.job.getUserJobs.useMutation();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [jobs, setJobs] = useState<Job[]>();

  const fetchUserJobs = async () => {
    if (session?.user.id) {
      const skip = jobs?.length * (page - 1) || 0;
      const data = await getUserJobs.mutateAsync({
        skip: skip,
        userId: session?.user.id,
      });
      setJobs(data.jobs);
      setHasMore(data.hasMore);
    }
  };

  useEffect(() => {
    fetchUserJobs();
  }, [session, page]);

  return (
    <>
      <ul className=" grid w-full gap-4">
        {jobs?.map((job) => {
          return <JobCard job={job} key={job.id} />;
        })}
      </ul>
      {jobs?.length === 0 && !getUserJobs.isLoading && <p>No job posted </p>}
      <div className=" my-6 flex justify-between">
        {page > 1 && (
          <SecondaryButton
            onClick={() => setPage((prev) => prev - 1)}
            className=" relative mr-auto  w-fit rounded-full bg-dark-500 py-2 text-white shadow-2xl shadow-dark-500/50"
            disable={getUserJobs.isLoading}
          >
            Prev
          </SecondaryButton>
        )}
        {hasMore && (
          <SecondaryButton
            onClick={() => setPage((prev) => prev + 1)}
            className=" relative ml-auto  w-fit rounded-full bg-dark-500 py-2 text-white shadow-2xl shadow-dark-500/50"
            disable={getUserJobs.isLoading}
          >
            Next
          </SecondaryButton>
        )}
      </div>
    </>
  );
};

export default UserPostedJobs;
