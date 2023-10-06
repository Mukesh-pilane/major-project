"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, ReactNode, useState } from "react";
import PrimaryButton from "../button/PrimaryButton";
import SecondaryButton from "../button/SecondaryButton";
import { usePathname } from 'next/navigation'

export default function Modal({
  children,
  button,
  isApplied
}: {
  children: ReactNode;
  button: ReactNode;
isApplied:boolean;

}) {
  const searchParams = usePathname()
    // Check if the URL contains "/job"
  const  isJobPage = searchParams.includes("/job");




  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <SecondaryButton type="button" onClick={openModal} disable={isApplied}>
        {button}
      </SecondaryButton>

      {isOpen && (
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-dark-500 bg-opacity-50" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className={`flex min-h-full items-center justify-center p-4 text-center ${isJobPage ? 'min-h-min ' : ""}`}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel  className={`${isJobPage ? 'w-full max-w-3xl transform overflow-hidden rounded-sm bg-light-100 p-4 text-left align-middle shadow-xl transition-all dark:bg-dark-500' : 'max-w-md'}`}>



                    {children}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </>
  );
}
