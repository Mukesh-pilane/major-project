"use client";
import { motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import Image from 'next/image';
import { motionItem } from "~/utils/animation";
import TimeAgoComponent from '~/components/TimeAgo';
import SearchInput from '~/components/input/SearchInput';
import {RiFilterFill} from "react-icons/ri"
import { BiEdit } from "react-icons/bi";
const Appliedcandidates = ({ candidates }) => {
    console.log(candidates[0]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    return (
        <main className=" mx-auto flex flex-col  w-full h-full  px-4 py-4 pb-16  ">
            <div className="flex justify-between w-[80%] mx-auto items-center h-fit mb-3">
                <div className="flex gap-2 items-center font-semibold text-gray-600 "><RiFilterFill size={25} />Filters</div>
                <div className="w-[50%]"><SearchInput value={search} onChange={setSearch} /></div>
            </div>
            <motion.ul
                className=" w-[95%] px-11 h-full mx-auto bg-white p-4 list-none rounded-lg shadow-2xl shadow-accent-100/50 hover:shadow-lg hover:border border-gray-200"
            >

                <div className="px-2 grid grid-cols-4 gap-6 items-center mb-3">
                    <div className="font-semibold text-lg text-gray-500 w-40">Candidate Name</div>
                    <div className="font-semibold text-lg w-3/4 text-gray-500">Stage</div>
                    <div className="font-semibold text-lg w-3/4 text-gray-500">Changed On</div>
                    <div className="font-semibold text-lg w-3/4  text-gray-500">Score</div>
                </div>


                {candidates[0].appliedCandidates.map((candidatedata, index) => (
                    <motion.li
                        key={index}
                        variants={motionItem}
                        whileHover={{
                            scale: 1.025,
                        }}
                        transition={{
                            type: "spring",
                        }}
                        className=" flex  bg-white p-4 list-none rounded-lg shadow-md   hover:shadow-accent-100 hover:ring-2 hover:ring-accent-200"
                    >
                        <div className="flex w-[25%] items-center gap-4">
                            <Image
                                src={candidatedata.user.image || ""}
                                alt="user avatar"
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                            <span className=" font-medium text-lg">{candidatedata.user.name}</span>
                        </div>
                        <div className=" w-[25%] flex gap-3 items-center tracking-wider ">
                            <span className=' bg-indigo-600 px-2 py-1 rounded-md text-yellow-50'>{candidatedata.status}</span>
                            <BiEdit className="text-indigo-600 cursor-pointer"size={23}/>
                        </div>
                        <div className="flex w-[25%] items-center gap-4 px-4">
                            <TimeAgoComponent createdAt={candidatedata.createdAt} />
                        </div>
                        <div className="flex w-[25%] items-center gap-4 px-8">
                            {candidatedata.score}
                        </div>
                    </motion.li>
                ))}
            </motion.ul>
        </main >
    )
}

export default Appliedcandidates