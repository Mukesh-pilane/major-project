import { motion } from "framer-motion";
import { ReactNode } from "react";
import { PuffLoader } from "react-spinners";

type props = {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  disable?: boolean;
  onClick?: () => void;
  className?: string;
  loadingText?: string;
  title?: string;
};

const SecondaryButton = ({
  type = "button",
  children,
  disable = false,
  loadingText = "",
  loading = false,
  onClick,
  className = "",
  title = "",
}: props) => {
  return (
    <motion.button
      type={type}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{
        scale: 1.025,
      }}
      whileTap={{
        scale: [1, 1.02, 1],
      }}
      disabled={disable}
      className={`${className} flex items-center justify-center px-4  capitalize`}
      onClick={onClick}
      title={title}
    >
      {loading ? (
        <>
          <p className=" flex items-center gap-4 ">
            <span>
              <PuffLoader size={24} color="#6458ee" />
            </span>
            {loadingText}
          </p>
        </>
      ) : (
        <>{children}</>
      )}
    </motion.button>
  );
};

export default SecondaryButton;
