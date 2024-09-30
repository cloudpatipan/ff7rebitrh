import { IoCloseOutline } from "react-icons/io5";
import { Button } from "./Button";
import { motion, AnimatePresence } from "framer-motion";

export function Modal({ children, isOpen, onClose, className }) {

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const variants = {
    hidden: { opacity: 0, scale: 0.9 },  // แอนิเมชันตอนปิด
    visible: { opacity: 1, scale: 1 },   // แอนิเมชันตอนเปิด
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#021c3f]/90`}
          onClick={handleOutsideClick}
        >
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{
              ease: "easeInOut",
              duration: 0.5,
            }}
            className={`${className} relative shadow-lg bg-black/60 w-full max-w-lg h-auto border border-[#176db0]`}>
            <div className="absolute top-2 right-2">
              <IoCloseOutline size={30} onClick={onClose} />
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
