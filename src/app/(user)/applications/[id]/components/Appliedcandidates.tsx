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
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import type { RouterOutputs } from "~/utils/api";


type Appliedcandidates=RouterOutputs["jobApplications"]["getAppliedCandidatesById"];

const Appliedcandidates = ({ candidates }) => {

    const changestatus=api.jobApplications.jobStatus.useMutation({
        onError: (e) => {
            toast.error(`Something went wrong ${e.message}`);
          },
          onSuccess: () => {
            toast.success(`SuccessFully Updated Status`);
            setFlag(!flag);
          },
    })
    const newcandidatedata=api.jobApplications.getAppliedCandidatesById.useMutation({
        onError: (e) => {
            toast.error(`Something went wrong ${e.message}`);
          },
          onSuccess: () => {
    

          },
    })
    const [flag, setFlag] = useState(false);
    const [resumeAvailable, setResumeAvailable] = useState("");

    useEffect(()=>{
       const fetchdata=async()=>{

     
        const new2= await newcandidatedata.mutateAsync({id:candidates.id})
        setNews(new2)
    } 
         fetchdata();
    },[flag])
    const [search, setSearch] = useState("");
    const [news, setNews] = useState(candidates.appliedCandidates);
    
    const categories = [
        { id: 1, name: 'SELECTED' },
        { id: 2, name: 'APPLIED' },
        { id: 3, name: 'NOT_SELECTED' },
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
      
const hanldechangestatus=()=>{
void changestatus.mutate({applicationId:selectedCandidate.id,status:updateStatus})
console.log(changestatus);
setIsEditing(false);


}
    useEffect(() => {
        // Filter candidates based on the search input
        const filtered = news.filter(candidate => {
           
           if(search!==""){
            const nameMatch = candidate.user.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
            return nameMatch
           } 
           
            const categoryMatch =
            !selectedCategory ||
            selectedCategory === "All" ||
            candidate.status.toLowerCase() === selectedCategory.toLowerCase();
            
          return  categoryMatch ;
        });

        setFilteredCandidates(filtered);

    }, [search,selectedCategory]);

    const handleViewResume=(item)=>{
    //base64encoded file
    
    getResume(item).then((response)=>{
        setResumeAvailable(response.file)
    })
    }


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
                                {category.name.replace("_"," ")}
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
                            <div className="  flex col-span-1 gap-3  flex-wrap justify-center items-center tracking-wider ">
                                <span className=' bg-indigo-600 px-2  py-1 rounded-md text-yellow-50'>{candidatedata.status.replace('_',"")}</span>
                                <BiEdit onClick={()=>handleEditClick(candidatedata)} className="text-indigo-600 cursor-pointer" size={23} />
                            </div>
                            <div className="flex col-span-1 justify-center items-center gap-4 ">
                                <TimeAgoComponent createdAt={candidatedata.updatedAt} />
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
                    news.map((candidatedata, index) => (


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
                            <div className="  flex col-span-1 gap-3  flex-wrap justify-center items-center tracking-wider ">
                                <span className=' bg-indigo-600 px-2  py-1 rounded-md text-yellow-50'>{candidatedata.status.replace('_',"")}</span>
                                <BiEdit onClick={()=>handleEditClick(candidatedata)} className="text-indigo-600 cursor-pointer" size={23} />
                            </div>
                            <div className="flex col-span-1 justify-center items-center gap-4 ">
                                <TimeAgoComponent createdAt={candidatedata.updatedAt} />
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
            <div  className="absolute w-[500px] p-4 z-999 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border rounded-md shadow-md">
              <label htmlFor="">Selected Stage : </label> 
              <select
                className=" p-2 border w-[50%] border-indigo-500 rounded-md outline-none "
                value={updateStatus}
                onChange={(e) => {
                    setUpdateStatus(e.target.value)}}
              >
                <option value="SELECTED">Selected</option>
                <option value="APPLIED">Applied</option>
                <option value="NOT_SELECTED">Not Selected</option>

              </select>
              <div className="mt-6 grid grid-cols-2 gap-6">
                      <button
                        className="  py-2 "
                        onClick={()=>setIsEditing(false)}
                      >
                        Cancel
                      </button>
                      <button
                   
     onClick={()=>hanldechangestatus()}
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