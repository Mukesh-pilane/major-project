import Link from "next/link";
import React from "react";
import { toast } from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import ConfirmModal from "~/components/modal/ConfirmModal";
import { api } from "~/utils/api";

const AdminJobCardControl = ({ job }) => {
  const ctx = api.useContext();
  const deleteJob = api.job.deleteJob.useMutation({
    onSuccess: () => {
      toast.success("Deleted Successfully");
      void ctx.job.adminGetApprovedJobs.invalidate();
      void ctx.job.adminGetUnApprovedJobs.invalidate();
    },
    onError: () => {
      toast.error(`Something went wrong ${deleteJob?.error?.message}`);
    },
  });
  const handleDelete = () => {
    deleteJob.mutateAsync({
      id: job.id,
    });
  };

  return (
    <div className=" flex gap-4">
      <p
        className={` flex w-fit items-center justify-center rounded-full px-4 text-xs text-white ${
          job.approved ? "bg-green-500" : "bg-red-400"
        }`}
      >
        {job.approved ? "Approved" : "Pending"}
      </p>
      <p
        className={` flex w-fit items-center justify-center rounded-full px-4 text-xs text-white ${
          job.featured ? "bg-accent-500" : "bg-red-400"
        }`}
      >
        {job.featured ? "Featured" : "Normal"}
      </p>
      <div className=" z-20 ml-auto flex items-center gap-4">
        <Link
          title={`Edit page link for job`}
          href={`/admin/edit/job/${job.id}`}
          target={"_blank"}
        >
          <BiEdit
            size={20}
            className="text-accent-500 transition-all duration-300 ease-in-out hover:scale-110"
          />
        </Link>
        <ConfirmModal
          title="Delete"
          loading={deleteJob.isLoading}
          subTitle="You want to delete this job listing from our site ???"
          button={<AiOutlineDelete size={20} className="text-red-400" />}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
};

export default AdminJobCardControl;
