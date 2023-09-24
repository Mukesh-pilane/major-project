"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { BiEdit } from "react-icons/bi";

const JobAdminControl = ({ jobId }) => {
  const { data: session } = useSession();
  if (!session?.user.isAdmin) {
    return null;
  }
  return (
    <div className=" absolute inset-y-0 right-4 my-auto flex  h-fit flex-col gap-2">
      <Link
        target={"_blank"}
        className="rounded-full bg-accent-500 p-3  text-gray-50  transition-all duration-300 ease-in-out hover:scale-105"
        title="Edit this job (Admin Edit)"
        href={`/admin/edit/job/${jobId}`}
      >
        <BiEdit size={20} />
      </Link>
    </div>
  );
};

export default JobAdminControl;
