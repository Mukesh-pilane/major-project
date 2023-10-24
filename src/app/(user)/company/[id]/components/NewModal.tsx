"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineClose } from 'react-icons/ai';
import { api } from '~/utils/api';
import { getResume } from '~/utils/flaskApi';
import PDFViewer from '~/app/(user)/applications/[id]/components/PdfViewer';


const Modal = ({ id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State for controlling the modal
  const [topResumes, setTopResumes] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null); // New state to track selected job
  const [isResumeView, setIsResumeView] = useState(false); // State to control card/resume view
  const [resumeAvailable, setResumeAvailable] = useState("");
  const [isLoadingResume, setIsLoadingResume] = useState(false);
  const TopResumes = api.company.getCompanyJobsTopresume.useMutation({
    onSuccess: (data) => {
      if (data) {
        setTopResumes(data[0])
      }
      // Check if jobData exists and has applied candidates






    }
  })

  const handleViewResume = (item) => {
    //base64encoded file
    setIsLoadingResume(true);
    getResume(item).then((response) => {
      setResumeAvailable(response.file)
      console.log(resumeAvailable);

    })
    setIsLoadingResume(false);
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);


  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  React.useEffect(() => {
    const res = TopResumes.mutateAsync({ id });
  }, [])




  const handleApply = (job: any) => {
    console.log(job);

    setIsResumeView(true);
    setSelectedJob(job);
    console.log(selectedJob);

    handleViewResume(job.appliedCandidates[0]?.fileId)
  };

  return (
    <>
      <h1 className="p-2 text-white font-semibold cursor-pointer " onClick={handleOpenModal}>Top Resumes</h1>
      {console.log(topResumes)
      }
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="bg-[rgba(0,0,0,0.5)] fixed z-40 inset-0"></div>
            <div className=" bg-white max-w-xl mx-auto max-h-[500px] rounded shadow-lg z-50 overflow-y-auto">
              <button onClick={handleCloseModal} className="absolute cursor-pointer px-4 py-2 text-white rounded-lg right-2.5 top-2.5 hover:scale-[1.045] bg-indigo-600 hover:bg-indigo-400">
                <AiOutlineClose size={24} />
              </button>
              <div className=" min-w-[570px] min-h-fit flex  flex-col items-center p-8">

                {isResumeView ? (
                  // Displaying Resume View

                  <div className='flex flex-col w-[85%]'>
                    <button className='mb-[-40px]' onClick={() => setIsResumeView(false)}>Go Back</button>
                    {(resumeAvailable && !isLoadingResume) ? (
                      <div className='p-4 mt-8 flex flex-col items-center'>
                        <PDFViewer base64String={resumeAvailable} />
                        </div>
                    ):(<>
                        <p>Loading resume, please wait...</p>
                    </>)}
                  </div>

                ) : (
                  // Displaying Job Listing Card
                  <div className='w-full'>
                    {topResumes && topResumes.jobs.length > 0 ? (
                      topResumes.jobs.map((job) => (
                        <div key={job.id} className="my-2 p-2 flex w-[100%] items-center justify-between border border-gray-300 rounded-lg">
                          <h2 className="text-lg font-semibold">{job.title}</h2>
                          <p className="text-gray-500">{job.role}
                          </p>
                          <button
                            onClick={() => handleApply(job)} // Handle Apply button click
                            className={`bg-indigo-600 text-white px-4 py-2 rounded-lg mt-2 ${!job.appliedCandidates || job.appliedCandidates.length === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                            disabled={!job.appliedCandidates || job.appliedCandidates.length === 0}
                          >
                            View Resume
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="flex w-[85%]">No Resumes are Available</p>
                    )}
                  </div>
                )}

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Modal;

