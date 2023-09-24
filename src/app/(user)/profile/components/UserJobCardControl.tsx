"use client";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import ConfirmModal from "~/components/modal/ConfirmModal";
import { api } from "~/utils/api";

const UserJobCardControl = ({ job }) => {
  const { data: session } = useSession();
  const deleteJob = api.job.userJobDelete.useMutation({
    onSuccess: () => {
      toast.success("Job listing Deleted successfully");
      window.location.reload();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  const handleDelete = async () => {
    if (session?.user) {
      void deleteJob.mutate({
        id: job.id,
        userId: session.user.id,
      });
    }
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

      <ConfirmModal
        title="Delete"
        loading={deleteJob.isLoading}
        subTitle="You want to delete this job listing from our site ???"
        button={<AiOutlineDelete size={20} className="text-red-400" />}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default UserJobCardControl;
