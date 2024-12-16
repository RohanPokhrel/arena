import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  title: string;
}

export function Modal({ children, onClose, title }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md relative my-8"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{title}</h2>

        {children}
      </motion.div>
    </div>
  );
}
