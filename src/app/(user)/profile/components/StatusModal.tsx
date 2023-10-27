"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineClose } from 'react-icons/ai';
import { fetchRecommendation } from '~/utils/flaskApi';


const StatusModal = async ({ keyword,setIsmodal, ismodal}) => {
  let Recommendations
  if(ismodal) {
   Recommendations = ismodal && await fetchRecommendation(keyword);
  }
  console.log(Recommendations);
  
  return (
    <>
 
      <AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="bg-[rgba(0,0,0,0.5)] fixed z-40 inset-0"></div>
            <div className=" bg-white max-w-xl mx-auto max-h-[500px] rounded shadow-lg z-50 overflow-y-auto">
              <button onClick={setIsmodal} className="absolute cursor-pointer px-4 py-2 text-white rounded-lg right-2.5 top-2.5 hover:scale-[1.045] bg-indigo-600 hover:bg-indigo-400">
                <AiOutlineClose size={24} />
              </button>
              </div>

          </motion.div>
        
      </AnimatePresence>
    </>
  );
};

export default StatusModal;

