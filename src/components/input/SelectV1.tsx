import { ErrorMessage, Field } from "formik";
import React from "react";
import { FiChevronDown } from "react-icons/fi";

const SelectV1 = ({ options, title, name }) => {
  return (
    <div className="relative">
      <div className="relative grid">
        <label
          htmlFor={name}
          className=" pb-1  text-xs capitalize text-gray-600 dark:text-gray-100"
        >
          {title}
        </label>
        <Field
          as="select"
          name={name}
          className={`w-full rounded-md bg-white py-2 pl-4 text-base font-normal text-gray-900 ring-1 ring-gray-500 ring-opacity-25 placeholder:text-sm placeholder:text-gray-400  focus:outline-none focus:ring-2 focus:ring-accent-500 dark:text-gray-50 dark:ring-opacity-50`}
        >
          {[{ name: "Select One", id: undefined }, ...options].map((option) => {
            return (
              <option className=" capitalize" key={option.id} value={option.id}>
                {option.name}
              </option>
            );
          })}
        </Field>
        <FiChevronDown
          size={20}
          className="  absolute inset-y-0 -bottom-5  right-2 z-50 my-auto  text-accent-500 transition-all duration-300 ease-in-out group-hover:text-accent-500"
        />
      </div>
      <ErrorMessage
        className=" absolute -bottom-5 left-2 text-xs font-medium text-red-500"
        name={name}
      >
        {(msg) => (
          <div className=" absolute -bottom-5 left-2 text-xs font-medium text-red-500">
            {msg}
          </div>
        )}
      </ErrorMessage>
    </div>
  );
};

export default SelectV1;
