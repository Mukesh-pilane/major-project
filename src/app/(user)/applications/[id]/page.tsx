import type { Metadata } from "next";
import { prisma } from "~/server/db";
import NotFound from "./components/NotFound";
import NoApplications from "./components/NoApplications";
import { api } from "~/utils/api";

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

const JobApplicationsPage = async ({ params: { id } }: Params) => {
  const jobApplications = await prisma.jobApplication.findMany({
    where: {
      id: id,
    },
    include: {
      user:true
    },
  });

  

  if (jobApplications.length==0) return <NoApplications />;
  return (
    <main className=" mx-auto grid h-full w-full max-w-7xl gap-6 px-4 py-4 pb-16 md:grid-cols-[72%_1fr] md:py-10 ">
        {
//first user use map to get all data
        }
        <div>{jobApplications[0]?.user.name}</div>
    </main>
  );
};

export default JobApplicationsPage;

export async function generateStaticParams() {
  const jobs = await prisma.job.findMany();
  return jobs.map((job) => ({
    id: job.id.toString(),
  }));
}
