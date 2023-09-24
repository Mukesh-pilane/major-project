import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { AiFillLinkedin, AiOutlineGlobal } from "react-icons/ai";
import { motionItem } from "~/utils/animation";
import type { RouterOutputs } from "~/utils/api";

type Company = RouterOutputs["company"]["getAll"][0];

const CompanyCard = ({ company }: { company: Company }) => {
  return (
    <motion.li
      variants={motionItem}
      whileHover={{ scale: 1.025 }}
      transition={{
        type: "spring",
      }}
      className="group relative grid grid-cols-[1fr_auto] rounded-2xl bg-white p-4   shadow-2xl shadow-accent-100/50 hover:shadow-accent-200  hover:ring-2 hover:ring-accent-200  md:grid-cols-1"
    >
      <Link
        href={`/company/${company.id}`}
        title={`${company.name} more info and jobs`}
        className="grid w-full grid-cols-[auto_1fr_auto]  gap-2 gap-x-4   md:grid-cols-1 md:text-center"
        target={"_blank"}
      >
        <Image
          width={75}
          height={75}
          src={company.logo}
          className="m-auto aspect-square h-full max-h-16 w-full  max-w-[5rem] object-contain"
          alt={company.name}
        />

        <h2 className=" text-lg font-medium capitalize line-clamp-1">
          {company.name.toLowerCase()}
        </h2>
      </Link>
    </motion.li>
  );
};

export default CompanyCard;
