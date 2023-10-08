"use client";
import { motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import Image from 'next/image';
import { motionItem } from "~/utils/animation";
import TimeAgoComponent from '~/components/TimeAgo';
import SearchInput from '~/components/input/SearchInput';
import { RiFilterFill } from "react-icons/ri"
import { BiEdit } from "react-icons/bi";
import { getResume } from "~/utils/flaskApi";
const Appliedcandidates = ({ candidates }) => {

    const [search, setSearch] = useState("");
    const categories = [
        { id: 1, name: 'Selected' },
        { id: 2, name: 'Applied' },
        { id: 3, name: 'Not Selected' },
    ];
    const [selectedCategory, setSelectedCategory] = useState("All"); // Initialize with empty string
    const [isEditing, setIsEditing] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(null);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [filteredCandidates, setFilteredCandidates] = useState([]); // Initialize with all candidates
    const handleCategoryChange = (categoryName) => {
      setSelectedCategory(categoryName);
    };

   
// selected candidate stage change
    const handleEditClick = (candidate) => {
        const {status}=candidate
        setIsEditing(true);
        
        setUpdateStatus(status)
        setSelectedCandidate(candidate);
        console.log(candidate);
        

        console.log(updateStatus);
        
      };
      

    useEffect(() => {
        // Filter candidates based on the search input
        const filtered = candidates[0].appliedCandidates.filter(candidate => {
           
           if(search!==""){
            const nameMatch = candidate.user.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
            return nameMatch
           } 
           
            const categoryMatch =
            !selectedCategory ||
            selectedCategory === "All" ||
            candidate.status.toLowerCase() === selectedCategory.toLowerCase();
            console.log(categoryMatch);
            
          return  categoryMatch ;
        });

        setFilteredCandidates(filtered);
        console.log(filteredCandidates);

        console.log(search);

    }, [search,selectedCategory]);

    const handleViewResume=(item)=>{
    //base64encoded file
    console.log(item);
    
    getResume(item).then((response)=>{
        console.log(response.file); 
    })
    }


    { console.log(candidates[0].appliedCandidates) }
    return (
        <main className=" mx-auto relative flex flex-col  w-full h-full  px-4 py-4 pb-16  ">
            <div className="flex justify-between w-[80%] mx-auto items-center h-fit mb-3">
                <div className="flex gap-2 items-center font-semibold text-gray-600 ">
                    <ul className="grid w-full  grid-flow-col  gap-6 overflow-auto p-4 py-8">
                    <div
      onClick={() => handleCategoryChange("All")}
      className={`relative flex w-fit flex-nowrap items-center gap-2 whitespace-nowrap rounded-3xl py-2.5 px-4 text-center text-sm shadow-xl shadow-accent-100/50 transition-transform duration-200 ease-in-out ${
        selectedCategory === "All"
          ? "bg-indigo-600 text-white"
          : "bg-white text-gray-600 hover:scale-105 hover:shadow-accent-200/50 hover:ring-2 hover:ring-accent-200"
      }`}
    >
      All
    </div>

                        {categories.map((category) => (
                            <div  onClick={() => handleCategoryChange(category.name)}   className={`relative flex w-fit flex-nowrap items-center gap-2 whitespace-nowrap rounded-3xl py-2.5 px-4 text-center text-sm shadow-xl shadow-accent-100/50 transition-transform duration-200 ease-in-out ${
                                selectedCategory === category.name
                                  ? "bg-indigo-600 text-white"
                                  : "bg-white text-gray-600 hover:scale-105 hover:shadow-accent-200/50 hover:ring-2 hover:ring-accent-200"
                              }`}>
                                {category.name}
                            </div>
                        ))}
                    </ul>
                </div>
                <div className="w-[50%]"><SearchInput value={search} onChange={setSearch} placeholder="Search by Candidate Name " /></div>
            </div>
            <motion.ul
                className=" w-[95%] px-11 h-full mx-auto bg-white p-4 list-none rounded-lg shadow-2xl shadow-accent-100/50 hover:shadow-lg hover:border border-gray-200"
            >

                <div className="px-2 grid grid-cols-7 gap-6 items-center mb-3">
                    <div className="font-semibold text-lg col-span-2 text-gray-500 ">Candidate Name</div>
                    <div className="font-semibold text-lg col-span-1  text-gray-500 ml-10">Stage</div>
                    <div className="font-semibold text-lg col-span-1  text-gray-500">Changed On</div>
                    <div className="font-semibold text-lg col-span-1 ml-14 text-gray-500">Score</div>
                    <div className="font-semibold text-lg col-span-1    text-gray-500">Classified</div>
                    <div className="font-semibold text-lg  col-span-1  ml-14  text-gray-500">Resume</div>
                </div>


                {filteredCandidates.length === 0 ? (
                    <p className="flex w-full items-center justify-center h-full font-semibold">
                    {search === "" ? "No Candidates Available" : "No result found for search query"}
                  </p>
                    
                ) : search !== "" ? (
                    filteredCandidates.map((candidatedata, index) => (

                        <motion.li
                            key={index}
                            variants={motionItem}
                            whileHover={{
                                scale: 1.025,
                            }}
                            transition={{
                                type: "spring",
                            }}
                            className=" grid grid-cols-7 gap-6  bg-white p-4 list-none rounded-lg shadow-md   hover:shadow-accent-100 hover:ring-2 hover:ring-accent-200"
                        >

<div className="flex col-span-2 items-center gap-4">
                                <Image
                                    src={candidatedata.user.image || ""}
                                    alt="user avatar"
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                                <span className=" font-medium text-lg">{candidatedata.user.name}</span>
                            </div>
                            <div className="  flex col-span-1 gap-3  justify-center items-center tracking-wider ">
                                <span className=' bg-indigo-600 px-2 py-1 rounded-md text-yellow-50'>{candidatedata.status}</span>
                                <BiEdit  onClick={()=>handleEditClick(candidatedata)}  className="text-indigo-600 cursor-pointer" size={23} />
                            </div>
                            <div className="flex col-span-1 justify-center items-center gap-4 ">
                                <TimeAgoComponent createdAt={candidates[0].updatedAt} />
                            </div>
                            <div className="flex col-span-1 items-center justify-center  ">
                                {candidatedata.score}
                            </div>
                            <div className="flex col-span-1 items-center justify-end gap-4 ">
                                {candidatedata.classified}
                            </div>
                            <div className="flex col-span-1 items-center justify-end gap-4 ">
                         <button onClick={()=>handleViewResume(candidatedata.fileId)} className="bg-indigo-600 p-2 tracking-wider rounded-lg text-white ">Resume</button>
                            </div>
                        </motion.li>
                    ))
                ) : (
                    candidates[0].appliedCandidates.map((candidatedata, index) => (


                        <motion.li
                            key={index}
                            variants={motionItem}
                            whileHover={{
                                scale: 1.025,
                            }}
                            transition={{
                                type: "spring",
                            }}
                            className=" grid grid-cols-7 gap-6  bg-white p-4 list-none rounded-lg shadow-md   hover:shadow-accent-100 hover:ring-2 hover:ring-accent-200"
                        >

                            <div className="flex col-span-2 items-center gap-4">
                                <Image
                                    src={candidatedata.user.image || ""}
                                    alt="user avatar"
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                                <span className=" font-medium text-lg">{candidatedata.user.name}</span>
                            </div>
                            <div className="  flex col-span-1 gap-3  justify-center items-center tracking-wider ">
                                <span className=' bg-indigo-600 px-2 py-1 rounded-md text-yellow-50'>{candidatedata.status}</span>
                                <BiEdit onClick={()=>handleEditClick(candidatedata)} className="text-indigo-600 cursor-pointer" size={23} />
                            </div>
                            <div className="flex col-span-1 justify-center items-center gap-4 ">
                                <TimeAgoComponent createdAt={candidates[0].updatedAt} />
                            </div>
                            <div className="flex col-span-1 items-center justify-center  ">
                                {candidatedata.score}
                            </div>
                            <div className="flex col-span-1 items-center justify-end gap-4 ">
                                {candidatedata.classified}
                            </div>
                            <div className="flex col-span-1 items-center justify-end gap-4 ">
                         <button onClick={()=>handleViewResume(candidatedata.fileId)} className="bg-indigo-600 p-2 tracking-wider rounded-lg text-white ">Resume</button>
                            </div>
                        </motion.li>

                    )))}

            </motion.ul>

            {isEditing && (
                <div className="fixed inset-0 bg-dark-500 bg-opacity-50 opacity-100" >
            <div  className="absolute w-[500px] p-4 z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border rounded-md shadow-md">
              <label htmlFor="">Selected Stage : </label> 
              <select
                className=" p-2 border w-[50%] border-indigo-500 rounded-md outline-none "
                value={updateStatus}
                onChange={(e) => {
                    setUpdateStatus(e.target.value)}}
              >
                <option value="selected">Selected</option>
                <option value="applied">Applied</option>
                <option value="not_selected">Not Selected</option>

              </select>
              <div className="mt-6 grid grid-cols-2 gap-6">
                      <button
                        className="  py-2 "
                        onClick={()=>setIsEditing(false)}
                      >
                        Cancel
                      </button>
                      <button
                   
     
                        className=" rounded-full bg-green-400 py-2 text-white"
                      >
                        Update
                      </button>
                    </div>
            </div>
            </div>
          )}
          
        </main >
    )
}

export default Appliedcandidates