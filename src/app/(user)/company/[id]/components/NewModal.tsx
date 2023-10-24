"use client"
import React,{useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineClose } from 'react-icons/ai';
import { api } from '~/utils/api';



const Modal = ({  content, id}) => {
    const [isModalOpen, setIsModalOpen] = useState(false); // State for controlling the modal
    const [topResumes, setTopResumes] = useState(null); 
    const TopResumes = api.company.getCompanyJobsTopresume.useMutation({onSuccess: (data) => {
      if (data){
        setTopResumes(data);
        
      }
    }})

    const handleOpenModal = () => {
      setIsModalOpen(true);
      
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

    
    React.useEffect(()=>{
      const res = TopResumes.mutate({id});
    }, [])

    
  return (
    <>
     <h1 className="p-2 text-white font-semibold cursor-pointer " onClick={handleOpenModal}>Top Resumes</h1>
     
   {topResumes && console.log(topResumes)}
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
          <div className=" bg-white max-w-lg mx-auto rounded shadow-lg z-50 overflow-y-auto">
            <button onClick={handleCloseModal} className="absolute cursor-pointer px-4 py-2 text-white rounded-lg right-2.5 top-2.5 hover:scale-[1.045] bg-indigo-600 hover:bg-indigo-400">
              <AiOutlineClose size={24} />
            </button>
            <div className="w-full p-2 ">{content}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default Modal;

