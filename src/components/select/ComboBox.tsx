"use client";
import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { HiChevronUpDown } from "react-icons/hi2";
import { RiCheckLine } from "react-icons/ri";

type option = {
  value: string;
  category?: string;
  title: string;
};

export default function ComboBox({
  title,
  options,
  onChange,
  selected,
}: {
  title: string;
  options: option[];
  selected: option;
  onChange: (option: option) => void;
}) {
  const [selectedOption, setSelectedOption] = useState(
    selected ? selected : {}
  );
  const [query, setQuery] = useState("");
  const filteredOptions: option[] =
    query === ""
      ? options
      : options.filter((option) =>
          option.title
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );
  const handleSelection = (newSelected) => {
    setSelectedOption(newSelected);
    if (onChange) onChange(newSelected);
  };
  return (
    <Combobox value={selectedOption} onChange={handleSelection} nullable>
      <div className="relative mt-1">
        <p className=" pb-1  text-xs capitalize text-gray-600 dark:text-gray-100">
          {title}
        </p>
        <div className="relative w-full cursor-default overflow-hidden rounded-md text-left ring-1  ring-accent-100 hover:ring-accent-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-black sm:text-sm">
          <Combobox.Input
            placeholder="Select any options"
            className="w-full border-none bg-white  py-2 pl-4 pr-10  capitalize text-gray-900 ring-2 placeholder:italic placeholder:text-gray-400 focus:outline-none"
            displayValue={(option: option) => option?.title}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <HiChevronUpDown
              className="h-5 w-5  text-accent-500"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute z-[100] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ">
            {filteredOptions.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredOptions.map((option) => (
                <Combobox.Option
                  key={option.value}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2  pl-10 pr-4 ${
                      active ? "bg-accent-500 text-white" : "text-gray-900"
                    }`
                  }
                  value={option}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate capitalize ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {option.title}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-white" : "text-accent-500"
                          }`}
                        >
                          <RiCheckLine className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}
