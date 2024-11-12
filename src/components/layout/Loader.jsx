import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-sky-800 to-slate-900 z-50">
    <motion.h1
      initial={{ scale: 1, opacity: 1 }}
      animate={{ scale: [1, 1.1, 1], opacity: [1, 0.8, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="text-5xl font-bold text-white mb-8"
    >
      PQ Online
    </motion.h1>
    <div className="w-2/4 h-2 bg-gray-300 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 2 }}
        className="h-full bg-stone-400 rounded-full"
      />
    </div>
  </div>
);

export default Loader;
