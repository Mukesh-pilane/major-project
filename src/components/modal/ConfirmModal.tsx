"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import type { ReactNode } from "react";
import SecondaryButton from "../button/SecondaryButton";

const ConfirmModal = ({
  button,
  title,
  loading,
  subTitle,
  onConfirm,
  onCancel,
}: {
  button: ReactNode;
  loading: boolean;
  title: string;
  subTitle: string;
  onConfirm: () => void;
  onCancel?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOnCancel = () => {
    if (onCancel) onCancel();
    setIsOpen(false);
  };

  const handleOnConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  return (
    <>
      <SecondaryButton
        loading={loading}
        type="button"
        onClick={() => setIsOpen(true)}
      >
        {button}
      </SecondaryButton>

      {isOpen && (
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={handleOnCancel}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0  bg-dark-500 bg-opacity-50" />
            </Transition.Child>

            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="z-50 w-full max-w-md transform overflow-hidden rounded-md bg-light-100 p-4 px-6 text-left align-middle shadow-xl transition-all dark:bg-dark-500">
                    <Dialog.Title
                      className={" pb-2 text-2xl font-medium text-gray-700"}
                    >
                      {title}
                    </Dialog.Title>
                    <Dialog.Description>{subTitle}</Dialog.Description>
                    <div className="mt-6 grid grid-cols-2 gap-6">
                      <SecondaryButton
                        className="  py-2 "
                        onClick={handleOnCancel}
                      >
                        Cancel
                      </SecondaryButton>
                      <SecondaryButton
                        loading={loading}
                        disable={loading}
                        onClick={handleOnConfirm}
                        className=" rounded-full bg-green-400 py-2 text-white"
                      >
                        Confirm
                      </SecondaryButton>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </>
  );
};

export default ConfirmModal;
