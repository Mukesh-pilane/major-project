"use client";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import PageHeading from "~/components/PageHeading";
import UserJobListForm from "./components/UserJobListForm";

const JobList = () => {
  const { data: session } = useSession();
  if (!session?.user) {
    toast.error("Please login to perform this action");
  }
  return (
    <main className=" mx-auto w-full max-w-7xl px-4">
      <PageHeading
        title="List New Job"
        subtitle="Fill this form and wait for admin approval on approval job listing will
        be visible on website"
      />
      <UserJobListForm />
    </main>
  );
};

export default JobList;
