import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const BackButton = ({ to = '/', label = 'Back to Home' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <Link
        to={to}
        className="inline-flex items-center space-x-2 px-4 py-2 text-dark-300 hover:text-white hover:bg-dark-700/50 rounded-lg transition-all duration-200 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
        <span className="text-sm font-medium">{label}</span>
      </Link>
    </motion.div>
  );
};

export default BackButton;


