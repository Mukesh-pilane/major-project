import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BiAddToQueue, BiLogOut } from "react-icons/bi";
import LinkIcon from "../button/LinkIcon";
import SecondaryButton from "../button/SecondaryButton";

const Header = () => {
  const { data: session } = useSession();
  return (
    <header className=" py-4">
      <nav className=" mx-auto flex max-w-7xl items-center justify-between px-4">
        <Link
          href="/"
          className=" group flex items-center gap-2 rounded-full  text-gray-500 transition-all duration-300 ease-in-out hover:text-accent-400"
        >
          <Image
            loading="lazy"
            src="/assets/logo/brandLogo.svg"
            alt="brand logo"
            width={40}
            height={50}
            className="aspect-square object-contain"
          />
          <div className=" relative flex">
            <h2 className=" relative text-xl font-medium  tracking-wide">
              JOB HiVE
            </h2>
            <Image
              loading="lazy"
              src="/assets/logo/hexagon.svg"
              alt="brand logo"
              width={15}
              height={15}
              className="absolute -top-2 -right-4 aspect-square object-contain duration-300 ease-in-out group-hover:rotate-180"
            />
          </div>
        </Link>
        <ul className=" flex items-center gap-2">
          {session?.user ? (
            <>
              <li>
                <Link
                  href={"/profile"}
                  className=" flex items-center gap-2 rounded-full bg-white py-2 pl-2 pr-4 text-sm text-gray-700  transition-all duration-300 ease-in-out hover:bg-accent-500 hover:text-gray-50 "
                >
                  <Image
                    src={session?.user?.image || ""}
                    alt="user avatar"
                    width={20}
                    height={20}
                    className=" rounded-full"
                  />
                  <p className=" hidden  md:block">{session?.user?.name}</p>
                </Link>
              </li>
              {session?.user.isAdmin && (
                <Link
                  href="/admin"
                  title="Go to admin page"
                  className=" flex items-center gap-2 rounded-full bg-white py-2 px-4 text-sm text-gray-700  transition-all duration-300 ease-in-out hover:bg-accent-500 hover:text-gray-50 "
                >
                  Admin
                </Link>
              )}
              {!session?.user.isAdmin && (
                <Link
                  href="/list/job"
                  title="List new Job"
                  className=" flex items-center gap-2 rounded-full bg-white py-2 px-4 text-sm text-gray-700  transition-all duration-300 ease-in-out hover:bg-accent-500 hover:text-gray-50 "
                >
                  <BiAddToQueue /> <p className=" hidden md:block">List Job</p>
                </Link>
              )}
              <li>
                <SecondaryButton
                  className=" flex items-center gap-2 rounded-full bg-white py-2 px-4 text-sm text-gray-700  transition-all duration-300 ease-in-out hover:bg-accent-500 hover:text-gray-50 "
                  title="Log out"
                  onClick={() => void signOut()}
                >
                  <BiLogOut />
                  <p className=" hidden md:block">Log Out</p>
                </SecondaryButton>
              </li>
            </>
          ) : (
            <li>
              <SecondaryButton
                className=" rounded-full bg-white py-2 px-4 text-gray-700  transition-all duration-300 ease-in-out hover:bg-accent-500 hover:text-gray-50 "
                onClick={() => void signIn("google")}
              >
                Sign In
              </SecondaryButton>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
