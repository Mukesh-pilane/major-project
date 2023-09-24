"use client";
import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";

const SearchInput = ({
  onChange,
  value,
}: {
  onChange: (string) => void;
  value: string;
}) => {
  const [input, setInput] = useState(value ?? "");

  //Debounce in react using useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(input);
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [input, onChange]);

  return (
    <>
      <label className="relative block">
        <span className="sr-only">Search</span>
        <BiSearch
          className="absolute inset-y-0 left-2 flex h-full  w-5   text-accent-500 "
          size={26}
        />

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className=" block w-full rounded-md bg-white py-2 pl-9 pr-3 shadow-sm ring-1 ring-accent-100 placeholder:italic placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-accent-500 sm:text-sm"
          placeholder="Search for anything..."
          type="text"
          name="search"
        />
      </label>
    </>
  );
};

export default SearchInput;
