import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

type OnDropFunction = (acceptedFiles: File[]) => void;

const PdfUpload = ({ onChange }: { onChange: (file: File) => void }) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const onDrop: OnDropFunction = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    console.log(file);
    
    setPdfFile(file);
    onChange(file);
  }, [onChange]);

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
      {pdfFile ? (
        <div className="mx-auto">
          <p className="mx-auto">{pdfFile.name}</p>
        </div>
      ) : (
        <p className="mx-auto">----</p>
      )}
    </div>
  );
};

export default PdfUpload;
