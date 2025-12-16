import React from 'react';
import { FiX, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const UserListModal = ({ isOpen, onClose, title, users, isLoading }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300 animate-in fade-in">
            <div
                className="bg-brand-surface dark:bg-brandDark-surface rounded-2xl w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100 opacity-100 border border-brand-border dark:border-brandDark-border flex flex-col max-h-[80vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-brand-border dark:border-brandDark-border shrink-0">
                    <h3 className="text-xl font-bold text-brand-text dark:text-brandDark-text">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-brand-bg dark:hover:bg-brandDark-bg text-brand-muted dark:text-brandDark-muted hover:text-brand-text dark:hover:text-brandDark-text transition-colors"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-brand-border dark:scrollbar-thumb-brandDark-border">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-10">
                            <div className="w-8 h-8 border-4 border-brand-border dark:border-brandDark-border border-t-brand-primary rounded-full animate-spin"></div>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-8 text-center text-brand-muted dark:text-brandDark-muted flex flex-col items-center">
                            <FiUser className="text-4xl mb-3 opacity-50" />
                            <p>No users found.</p>
                        </div>
                    ) : (
                        <ul className="space-y-1">
                            {users.map((user) => (
                                <li
                                    key={user._id}
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-bg dark:hover:bg-brandDark-bg transition-colors group cursor-pointer"
                                    onClick={() => {
                                        navigate(`/profile/${user._id}`);
                                        onClose();
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white font-bold text-lg shadow-sm overflow-hidden shrink-0">
                                            {user.profilePicture ? (
                                                <img src={`http://localhost:5000/uploads/${user.profilePicture}`} alt={user.username} className="w-full h-full object-cover" />
                                            ) : (
                                                user.username?.[0]?.toUpperCase() || '?'
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-semibold text-brand-text dark:text-brandDark-text truncate">
                                                {user.username || 'Unknown User'}
                                            </h4>
                                            {user.email && (
                                                <p className="text-xs text-brand-muted dark:text-brandDark-muted truncate">
                                                    {user.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserListModal;
