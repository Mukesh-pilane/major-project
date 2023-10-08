import type { Metadata } from "next";
import { prisma } from "~/server/db";
import NotFound from "./components/NotFound";
import NoApplications from "./components/NoApplications";

import Appliedcandidates from "./components/Appliedcandidates";

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
  const jobApplications = await prisma.job.findFirst({
    where: {
      id: id,
    },
    include: {
      user:true,
      appliedCandidates:{
        include:{
          user:true
        }
      }
    },
  });

  console.log(jobApplications);
  

  if (!jobApplications) return <NoApplications />;
  return (
    <>
     <Appliedcandidates candidates={jobApplications} />
    </>

  );
};

export default JobApplicationsPage;

export async function generateStaticParams() {
  const jobs = await prisma.job.findMany();
  return jobs.map((job) => ({
    id: job.id.toString(),
  }));
}
