import type { Metadata } from "next";
import JobAdminControl from "~/app/(admin)/admin/components/JobAdminControl";
import { prisma } from "~/server/db";
import JobHeader from "./components/JobHeader";
import NotApproved from "./components/NotApproved";
import NotFound from "./components/NotFound";
import SideBarV2 from "./components/SideBarV2";

type Params = {
  params: {
    id: string;
  };
};

export async function generateMetadata({
  params: { id },
}: Params): Promise<Metadata> {
  const job = await prisma.job.findUnique({
    where: {
      id: id,
    },
  });
  return {
    title: job.title,
    applicationName: "Job hive",
    icons: {
      icon: "/assets/logo/hexagon.svg",
    },
    robots: {
      index: false,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: false,
        noimageindex: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
export const revalidate = 60;

const JobPage = async ({ params: { id } }: Params) => {
  const job = await prisma.job.findUnique({
    where: {
      id: id,
    },
    include: {
      category: true,
      subCategory: true,
      company: true,
    },
  });
  if (!job.approved) return <NotApproved />;
  if (!job) return <NotFound />;
  return (
    <main className=" mx-auto grid h-full w-full max-w-7xl gap-6 px-4 py-4 pb-16 md:grid-cols-[72%_1fr] md:py-10 ">
      <JobAdminControl jobId={job.id} />

      <div className=" flex flex-col gap-6">
        <JobHeader job={job} />
        <div className=" rounded-md bg-white p-4">
          <h2 className="pb-2 text-[clamp(1rem,10vw,1.5rem)] font-medium capitalize">
            Job Description
          </h2>
          <div
            dangerouslySetInnerHTML={{ __html: `${job.desc}` }}
            className=" richtext "
          />
        </div>
        {job?.applyInstruction && (
          <div className=" rounded-md bg-white p-4">
            <h2 className="pb-2 text-[clamp(1rem,10vw,1.5rem)] font-medium capitalize">
              Apply Instruction
            </h2>
            <div
              dangerouslySetInnerHTML={{ __html: `${job.applyInstruction}` }}
              className=" richtext "
            />
          </div>
        )}
      </div>

      {/* Client side component due to framer motion animation  */}
      {/* <SideBar job={job} /> */}
      <SideBarV2 job={job} />
    </main>
  );
};

export default JobPage;

export async function generateStaticParams() {
  const jobs = await prisma.job.findMany();
  return jobs.map((job) => ({
    id: job.id.toString(),
  }));
}
