"use client";
import { useSession } from "next-auth/react";
import { BiAlarm, BiBuildings, BiCategory } from "react-icons/bi";
import LinkIcon from "~/components/button/LinkIcon";
import CompanyList from "~/components/company/CompanyList";
import ApprovedJobList from "./components/ApprovedJobList";
import UnApprovedJobList from "./components/UnApprovedJobList";

const AdminPage = () => {
  const { data: session } = useSession();
  if (!session?.user.isAdmin) return null;
  return (
    <main className=" mx-auto w-full max-w-7xl py-10">
      <div className="flex w-full flex-wrap items-center justify-center gap-6">
        <LinkIcon href="/admin/list/job" title="List Job" icon={BiAlarm} />
        <LinkIcon
          href="/admin/list/company"
          title="List Company"
          icon={BiBuildings}
        />
        <LinkIcon href="/admin/category" title="Categories" icon={BiCategory} />
      </div>
      <div className=" grid gap-6 py-10 px-4 sm:grid-cols-[auto_1fr_1fr]">
        <CompanyList />
        <ApprovedJobList />
        <UnApprovedJobList />
      </div>
    </main>
  );
};

export default AdminPage;
