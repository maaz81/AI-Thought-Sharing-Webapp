import React from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { logoutAdmin } from '../../../features/auth/authSlice'; // adjust path as needed

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modal = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

const LogoutModal = ({ isOpen, onClose, onLogout }) => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await dispatch(logoutAdmin()).unwrap(); // will throw if rejected
      onLogout(); // e.g., redirect to login page
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      onClose(); // close the modal
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg w-80"
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Are you sure you want to log out?
            </h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LogoutModal;
