"use client";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";

export const ValidationState = ({
  valid,
  label,
}: {
  valid: boolean;
  label: string;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className={`flex items-center gap-1.5 text-sm ${
      valid ? "text-green-600" : "text-gray-400"
    }`}
  >
    {valid ? (
      <FiCheckCircle className="w-4 h-4" />
    ) : (
      <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
    )}
    {label}
  </motion.div>
);
