"use client";
import UserPostedJobs from "./components/UserPostedJobs";
import { Tab } from "@headlessui/react";
import { useState } from "react";
import UserProfile from "./components/UserProfile";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const TabItem = ({ title }) => {
  return (
    <Tab
      as="button"
      className={({ selected }) =>
        classNames(
          "w-full rounded-md px-4 py-2.5 text-sm leading-5 ",
          "ring-white ring-opacity-60 ring-offset-2 ring-offset-accent-400 focus:outline-none focus:ring-2",
          selected
            ? "bg-accent-400  text-white shadow"
            : " text-gray-700 hover:bg-white/[0.12] hover:text-accent-500"
        )
      }
    >
      {title}
    </Tab>
  );
};

const TabPanelItem = ({ children }) => {
  return <Tab.Panel className={"h-full "}>{children}</Tab.Panel>;
};

const ProfilePage = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <main className=" mx-auto grid h-full w-full max-w-7xl gap-10 px-4 pb-16 md:grid-cols-[minmax(150px,250px)_1fr] md:py-10 ">
      <Tab.Group
        selectedIndex={selectedIndex}
        onChange={setSelectedIndex}
        vertical
      >
        <Tab.List className={"flex h-fit flex-col justify-start gap-4 p-2 "}>
          <TabItem title={"Profile"} />
          <TabItem title={"Posted Jobs"} />
        </Tab.List>
        <Tab.Panels>
          <TabPanelItem>
            <UserProfile />
          </TabPanelItem>
          <TabPanelItem>
            <UserPostedJobs />
          </TabPanelItem>
        </Tab.Panels>
      </Tab.Group>
    </main>
  );
};

export default ProfilePage;
