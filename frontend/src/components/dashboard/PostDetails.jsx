import React, { useEffect, useState } from 'react';
import Header from '../HeaderFooter/Header';
import Footer from '../HeaderFooter/Footer';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostDetails = () => {
    const { postId } = useParams(); 
    const navigate = useNavigate();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/post/${postId}`);
                setPage(response.data);
            } catch (error) {
                console.error("Failed to fetch page:", error);
                setError("Failed to fetch the page.");
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, [postId]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header />
                <div className="flex-1 flex items-center justify-center text-gray-600">Loading...</div>
                <Footer />
            </div>
        );
    }

    if (error || !page) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-800">Page not found</h2>
                        <p className="text-gray-600 mt-2">{error || "No page data was found."}</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Go back
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <div className="flex-1">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="bg-white rounded-xl shadow-md p-6 space-y-6 border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">{page.title}</h1>
                                <p className="text-sm text-gray-500 mt-2">
                                    Created at: {new Date(page.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <button
                                onClick={() => navigate(-1)}
                                className="text-gray-400 hover:text-red-500 transition text-xl"
                                title="Close"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="prose max-w-none text-gray-700">
                            {page.content?.split('\n').map((paragraph, i) => (
                                <p key={i}>{paragraph}</p>
                            )) || <p>No description provided.</p>}
                        </div>

                        {page.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {page.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PostDetails;
