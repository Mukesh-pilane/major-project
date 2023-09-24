import Link from "next/link";
import React from "react";
import type { IconType } from "react-icons";

const LinkIcon = ({
  title,
  icon: Icon,
  href,
}: {
  title: string;
  icon?: IconType;
  href: string;
}) => {
  return (
    <Link
      className=" relative flex w-fit flex-nowrap items-center gap-2 whitespace-nowrap rounded-3xl bg-white py-2 px-4  text-center text-sm shadow-xl shadow-accent-100/50 ring-2 ring-accent-400  transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-accent-200/50  hover:ring-2 hover:ring-accent-200"
      title={title}
      href={href}
    >
      <Icon size={18} />
      {title}
    </Link>
  );
};

export default LinkIcon;
