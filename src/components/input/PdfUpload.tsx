import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

type OnDropFunction = (acceptedFiles: File[]) => void;

const PdfUpload = ({onPdfChange, seleltedFile }) => {

  const onDrop: OnDropFunction = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

    onPdfChange(file)
  }, []);


  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: [".pdf"] as any, // Limit accepted file types to PDFs
  });

  return (
    <div className="grid grid-cols-2 py-4 px-4 ring-2 ring-accent-400">
      <div {...getRootProps()} className="flex items-center justify-center">
        <input {...getInputProps()} />
        <p className="text-center text-xs">
          Drag & drop PDF file, or click to select
        </p>
      </div>
      {seleltedFile ? (
        <div className="mx-auto">
          <p className="mx-auto">{seleltedFile.name}</p>
        </div>
      ) : (
        <p className="mx-auto">----</p>
      )}
    </div>
  );
};

export default PdfUpload;
