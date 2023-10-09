import React, { useState, useEffect } from 'react';
import { pdfjs } from 'react-pdf';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = (props) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [blob, setBlob] = useState(null);

  const removetextPdf = {
    display: 'none'
  };

  useEffect(() => {
    // Convert the base64 string to a Blob
    const byteCharacters = atob(props.base64String);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }

    const pdfBlob = new Blob([new Uint8Array(byteArrays)], { type: 'application/pdf' });
    setBlob(pdfBlob);
  }, [props.base64String]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    console.log('success');
  };

  const goToPreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const goToNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  return (
    <>
      {blob && (
        <>
          <Document file={blob} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
          </Document>
          <div className='flex justify-center w-[50px] mx-auto gap-3'>
            <button 
            className=" relative mr-auto  w-fit rounded-full bg-dark-500 p-2 py-1 text-white shadow-2xl shadow-dark-500/50"
            onClick={goToPreviousPage} disabled={pageNumber === 1}>
              Prev
            </button>
            <button 
            className=" relative ml-auto  w-fit rounded-full bg-dark-500 p-2 py-1 text-white shadow-2xl shadow-dark-500/50"
            
            onClick={goToNextPage} disabled={pageNumber === numPages}>
              Next
            </button>
          </div>
        </>
      )}
      <p
      className=' flex items-start justify-start p-2'>
        Page {pageNumber} of {numPages}
      </p>
    </>
  );
};

export default PDFViewer;
