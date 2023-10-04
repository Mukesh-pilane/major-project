import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { api } from "~/utils/api";


const AppliedJobs = () => {
    
  const { data: session } = useSession();
  const getAppliedJobs = api.jobApplications.getUserJobApplications.useQuery({id: session.user.id})
  //see the data and destructured it and map it in card
  console.log(getAppliedJobs.data);
  return (
    <div className="flex h-full w-full items-center justify-center gap-6">
      <h2 className=" md:text-4xl">Welcome {session?.user.name}</h2>
      <h1>Not Applied to any jobs</h1>
    </div>
  );
};

export default AppliedJobs ;
