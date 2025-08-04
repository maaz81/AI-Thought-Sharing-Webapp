import { useState } from "react";
import axios from 'axios';
import { FiPlus, FiTag, FiLock, FiGlobe, FiCheck, FiMessageSquare, FiX } from "react-icons/fi";
import AiSuggestionPanel from '../aiPanel/AiSuggestionPanel';
import AIChatbot from "../aiPanel/AIChatbot";

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    const [visibility, setVisibility] = useState("public");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [wordCount, setWordCount] = useState(0);
    const [suggestedTitles, setSuggestedTitles] = useState([]);
    const [suggestedDescription, setSuggestedDescription] = useState([]);
    const [suggestedTags, setSuggestedTags] = useState([]);
    const [aiLoading, setAiLoading] = useState(false);

    const [showChat, setShowChat] = useState(false);

    const displayAiChat = () => {
        if (!showChat) {
            setShowChat(true);
        }
        else {
            setShowChat(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ text: "", type: "" });

        const postData = {
            title,
            content,
            tags: tags.split(",").map(tag => tag.trim()).filter(tag => tag),
            visibility,
        };

        try {
            const response = await axios.post(
                'http://localhost:5000/api/post/create',
                postData,
                { withCredentials: true }
            );

            if (response.status === 201 || response.status === 200) {
                setMessage({
                    text: "Post created successfully!",
                    type: "success"
                });
                // Reset form
                setTitle("");
                setContent("");
                setTags("");
                setVisibility("public");
            } else {
                setMessage({
                    text: response.data.message || "Failed to create post",
                    type: "error"
                });
            }
        } catch (error) {
            console.error("Error creating post:", error);
            setMessage({
                text: error.response?.data?.message || "Network Error",
                type: "error"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                            <FiPlus className="mr-2" /> Create New Post
                        </h2>
                        <p className="text-blue-100 mt-1">Share your thoughts with the community</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Title Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="What's your post about?"
                                required
                            />
                        </div>

                        {/* Content Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Content
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setContent(value);
                                    const words = value.trim().split(/\s+/);
                                    setWordCount(words.filter(Boolean).length);
                                }}

                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition min-h-[200px]"
                                placeholder="Write your thoughts here..."
                                required
                            />
                        </div>

                        {/* Tags Field */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <FiTag className="mr-1" /> Tags
                            </label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="react, javascript, webdev (comma separated)"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Add relevant tags to help others find your post
                            </p>
                        </div>

                        {/* AI Suggestion Button */}
                        <div className="pt-2">
                            <button
                                type="button"
                                disabled={wordCount < 50 || aiLoading}
                                onClick={async () => {
                                    try {
                                        setAiLoading(true);
                                        const response = await axios.post("http://localhost:5000/api/ai/suggest", {
                                            title,
                                            description: content,
                                        });
                                        const { titles, descriptions, tags } = response.data;
                                        setSuggestedTitles(titles || []);
                                        setSuggestedDescription(descriptions || []);
                                        setSuggestedTags(tags || []);

                                    } catch (err) {
                                        console.error("AI Error:", err);
                                    } finally {
                                        setAiLoading(false);
                                    }
                                }}
                                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium transition-all ${wordCount < 50 || aiLoading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700"
                                    }`}
                            >
                                {aiLoading ? "Generating Suggestions..." : "✨ AI Suggestion"}
                            </button>
                            <p className="text-xs text-gray-500 mt-1">Enabled after 50+ words in content</p>
                        </div>


                        {/* Visibility Toggle */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Visibility
                            </label>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setVisibility("public")}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${visibility === "public"
                                        ? "bg-blue-50 border-blue-500 text-blue-700"
                                        : "border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    <FiGlobe />
                                    Public
                                    {visibility === "public" && <FiCheck className="ml-auto" />}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setVisibility("private")}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${visibility === "private"
                                        ? "bg-blue-50 border-blue-500 text-blue-700"
                                        : "border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    <FiLock />
                                    Private
                                    {visibility === "private" && <FiCheck className="ml-auto" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ${isSubmitting
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Publishing...
                                    </>
                                ) : "Publish Post"}
                            </button>
                        </div>


                        <AiSuggestionPanel
                            titles={suggestedTitles}
                            descriptions={suggestedDescription}
                            tags={suggestedTags}
                            onSelectTitle={setTitle}
                            onSelectDescription={setContent}
                            onSelectTags={setTags}
                        />



                        {/* Status Message */}
                        {message.text && (
                            <div className={`mt-4 p-4 rounded-lg ${message.type === "success"
                                ? "bg-green-50 text-green-800"
                                : "bg-red-50 text-red-800"
                                }`}>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        {message.type === "success" ? (
                                            <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium">
                                            {message.text}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Help Text */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Your post will be visible to {visibility === "public" ? "everyone" : "only you"}.</p>
                </div>
            </div>



            {/* Enhanced Chat UI */}
            {showChat ? (
                <div className="fixed bottom-6 right-6 w-full max-w-md bg-white shadow-xl rounded-t-2xl overflow-hidden border border-gray-200 flex flex-col"
                    style={{ height: '650px' }}>
                    {/* Chat Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <FiMessageSquare className="text-white text-lg" />
                            <h3 className="text-white font-semibold">AI Writing Assistant</h3>
                        </div>
                        <button
                            onClick={displayAiChat}
                            className="p-1 rounded-full hover:bg-blue-800 transition-colors text-white"
                            aria-label="Close chat"
                        >
                            <FiX className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Chat Content */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <AIChatbot />
                    </div>
                </div>
            ) : (
                <button
                    onClick={displayAiChat}
                    className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                    aria-label="Open AI chat"
                >
                    <FiMessageSquare className="h-6 w-6" />
                    <span className="sr-only">Chat with AI</span>
                </button>
            )}


        </div >
    );
};

export default CreatePost;