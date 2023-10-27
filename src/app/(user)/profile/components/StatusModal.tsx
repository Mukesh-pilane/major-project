"use client"
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineClose } from 'react-icons/ai';
import { fetchRecommendation } from '~/utils/flaskApi';




const StatusModal = ({ keyword,setIsmodal, ismodal}) => {
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    if (ismodal) {
      const fetchRecommendations = async () => {
        try {
          const data = await fetchRecommendation(keyword);
          setRecommendations(data);
          console.log(recommendations);
          
        } catch (error) {
          // Handle any fetch errors here
          console.error(error);
        }
      };
      
      fetchRecommendations();
    }
  }, [ismodal, keyword]);
  
  
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
          <div className="bg-white max-w-lg max-h-96 mx-auto rounded-lg shadow-lg z-50 overflow-auto">
            <button
              onClick={setIsmodal}
              className="absolute top-2.5  bg-indigo-600 text-white right-2.5 p-2 text-gray-700 rounded-full  focus:outline-none"
            >
              <AiOutlineClose size={24} />
            </button>
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Recommended Courses</h2>
              <div className="text-gray-700 grid grid-cols-1 gap-4 items-center">
                {recommendations && recommendations.Courses.length > 0 && recommendations.Courses.slice(0, 10).map((course, index) => (
                  <div key={index} className="mb-2 flex flex-col items-start justify-center">
                    <h3 className="text-lg font-semibold">
                      <h1

                        className="text-indigo-600 font-semibold "


                      >
                        {index+1+". "}{course.title}
                      </h1>
                    </h3>
                    <p><span className=' font-bold'>University:</span> {course.organization}</p>
                    <p><span className=' font-bold'> Course Link:</span> <a  target="_blank" rel="noopener noreferrer">https://example.com/course1</a></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default StatusModal;
