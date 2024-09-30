
"use client";
import { motion, AnimatePresence } from "framer-motion"

export function PageWarpper({ children }) {

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 4 }}
        exit={{ opacity: 0 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>

  )
}
