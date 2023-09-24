import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

type FileReaderEvent = ProgressEvent<FileReader> & {
  target: FileReader & { result: string };
};
type OnDropFunction = (acceptedFiles: File[]) => void;

const ImageUpload = ({
  onChange,
  value,
}: {
  value?: string;
  onChange: (base64: string) => void;
}) => {
  const [base64, setBase64] = useState<string>(value ? value : "");

  const handleChange = (base64: string) => {
    onChange(base64);
  };

  const onDrop: OnDropFunction = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader: FileReader = new FileReader();
      reader.onload = (event: FileReaderEvent) => {
        setBase64(event.target.result);
        handleChange(event.target.result);
      };
      reader.readAsDataURL(file);
    },
    [handleChange]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });
  return (
    <div className=" grid grid-cols-2 py-4 px-4 ring-2 ring-accent-400">
      <div {...getRootProps()} className="flex items-center justify-center">
        <input {...getInputProps()} />
        <p className=" text-center text-xs">
          Drag & drop Company Image, or Click to select
        </p>
      </div>
      {base64 ? (
        <div className=" mx-auto">
          <Image
            src={base64}
            className="flex aspect-square w-20 items-center justify-center rounded-md object-contain "
            alt="preview Image"
            width={100}
            height={100}
          />
        </div>
      ) : (
        <>
          <p className=" mx-auto">----</p>
        </>
      )}
    </div>
  );
};

export default ImageUpload;
