import CompanyList from "~/components/company/CompanyList";
import CategoryLinks from "~/components/home/CategoryLinks";
import Search from "~/components/home/Search";
import JobList from "~/components/job/JobList";

// Home Page metadata
export const metadata = {
  title: "Job Hive",
  description: "Buzzing with job opportunities",
  icons: {
    icon: "/assets/logo/hexagon.svg",
  },
};

const HomePage = () => {
  return (
    <main className=" mx-auto w-full max-w-7xl overflow-hidden px-4 pb-16">
      <Search />
      {/* ts-expect-error Async Server Component */}
      

      <CategoryLinks />

      <div className=" grid gap-6 md:grid-cols-2">
        {/* Hidden on small screens  */}
        <div className=" hidden md:block">
          <h2 className=" py-4 text-center text-[clamp(1rem,6vw,2rem)] font-medium capitalize">
            Companies
          </h2>
          <CompanyList />
        </div>
        <div>
          <h2 className=" py-4 text-center text-[clamp(1rem,6vw,2rem)] font-medium capitalize">
            Jobs
          </h2>
          <JobList />
        </div>
      </div>
    </main>
  );
};

export default HomePage;
