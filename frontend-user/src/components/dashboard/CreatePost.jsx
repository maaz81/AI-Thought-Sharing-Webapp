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
        setShowChat(!showChat);
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
        <div className="min-h-screen bg-brand-bg py-8 px-4 sm:px-6 lg:px-8 dark:bg-brandDark-bg dark:text-brandDark-text transition-colors duration-200">
            <div className="max-w-2xl mx-auto">
                {/* Main Card */}
                <div className="bg-brand-surface shadow-soft rounded-2xl overflow-hidden border border-brand-border dark:bg-brandDark-surface dark:border-brandDark-border transition-all duration-300 hover:shadow-lg">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-brand-primary to-brand-primary/90 p-6">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                            <FiPlus className="mr-3" /> Create New Post
                        </h2>
                        <p className="text-brand-bg/90 mt-2">Share your thoughts with the community</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Title Field */}
                        <div>
                            <label className="block text-sm font-medium text-brand-text mb-2 dark:text-brandDark-text">
                                Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 border border-brand-border rounded-2xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors bg-brand-surface dark:bg-brandDark-surface dark:border-brandDark-border dark:text-brandDark-text dark:placeholder:text-brandDark-muted"
                                placeholder="What's your post about?"
                                required
                            />
                        </div>

                        {/* Content Field */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-brand-text dark:text-brandDark-text">
                                    Content
                                </label>
                                <span className="text-xs text-brand-muted dark:text-brandDark-muted">
                                    {wordCount} words {wordCount >= 50 ? "✓" : ""}
                                </span>
                            </div>
                            <textarea
                                value={content}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setContent(value);
                                    const words = value.trim().split(/\s+/);
                                    setWordCount(words.filter(Boolean).length);
                                }}
                                className="w-full px-4 py-3 border border-brand-border rounded-2xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors bg-brand-surface dark:bg-brandDark-surface dark:border-brandDark-border dark:text-brandDark-text dark:placeholder:text-brandDark-muted min-h-[200px] resize-y"
                                placeholder="Write your thoughts here..."
                                required
                            />
                        </div>

                        {/* Tags Field */}
                        <div>
                            <label className="text-sm font-medium text-brand-text mb-2 flex items-center dark:text-brandDark-text">
                                <FiTag className="mr-2" /> Tags
                            </label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="w-full px-4 py-3 border border-brand-border rounded-2xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors bg-brand-surface dark:bg-brandDark-surface dark:border-brandDark-border dark:text-brandDark-text dark:placeholder:text-brandDark-muted"
                                placeholder="react, javascript, webdev (comma separated)"
                            />
                            <p className="mt-2 text-xs text-brand-muted dark:text-brandDark-muted">
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
                                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-2xl shadow-sm text-white font-medium transition-all duration-300 ${wordCount < 50 || aiLoading
                                    ? "bg-brand-muted cursor-not-allowed dark:bg-brandDark-muted"
                                    : "bg-gradient-to-r from-state-success to-state-info hover:opacity-90 transform hover:scale-[1.02]"
                                    }`}
                            >
                                {aiLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <span className="mr-2">✨</span>
                                        Get AI Suggestions
                                    </>
                                )}
                            </button>
                            <p className="text-xs text-brand-muted dark:text-brandDark-muted mt-2 text-center">
                                {wordCount < 50 ? `Write ${50 - wordCount} more words to unlock AI suggestions` : "AI suggestions unlocked!"}
                            </p>
                        </div>

                        {/* Visibility Toggle */}
                        <div>
                            <label className="block text-sm font-medium text-brand-text mb-3 dark:text-brandDark-text">
                                Visibility
                            </label>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setVisibility("public")}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border transition-all duration-300 ${visibility === "public"
                                        ? "bg-brand-primary/10 border-brand-primary text-brand-primary dark:bg-brand-primary/20 dark:border-brand-primary dark:text-white"
                                        : "border-brand-border hover:bg-brand-bg dark:border-brandDark-border dark:hover:bg-brandDark-bg"
                                        }`}
                                >
                                    <FiGlobe />
                                    Public
                                    {visibility === "public" && <FiCheck className="ml-auto" />}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setVisibility("private")}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border transition-all duration-300 ${visibility === "private"
                                        ? "bg-brand-primary/10 border-brand-primary text-brand-primary dark:bg-brand-primary/20 dark:border-brand-primary dark:text-white"
                                        : "border-brand-border hover:bg-brand-bg dark:border-brandDark-border dark:hover:bg-brandDark-bg"
                                        }`}
                                >
                                    <FiLock />
                                    Private
                                    {visibility === "private" && <FiCheck className="ml-auto" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-2xl shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all duration-300 transform hover:scale-[1.02] ${isSubmitting
                                    ? "bg-brand-primary/70 cursor-not-allowed"
                                    : "bg-gradient-to-r from-brand-primary to-brand-primaryHover hover:shadow-lg"
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

                        {/* AI Suggestion Panel */}
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
                            <div className={`mt-6 p-4 rounded-2xl border ${message.type === "success"
                                ? "bg-state-success/10 border-state-success text-state-success dark:bg-state-success/20"
                                : "bg-state-error/10 border-state-error text-state-error dark:bg-state-error/20"
                                }`}>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 pt-0.5">
                                        {message.type === "success" ? (
                                            <FiCheck className="h-5 w-5" />
                                        ) : (
                                            <FiX className="h-5 w-5" />
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
                <div className="mt-6 text-center text-sm text-brand-muted dark:text-brandDark-muted">
                    <p>Your post will be visible to {visibility === "public" ? "everyone" : "only you"}.</p>
                </div>
            </div>

            {/* Enhanced Chat UI */}
            {showChat ? (
                <div className="fixed bottom-6 right-6 w-full max-w-md bg-brand-surface shadow-soft rounded-2xl overflow-hidden border border-brand-border dark:bg-brandDark-surface dark:border-brandDark-border flex flex-col animate-slide-up"
                    style={{ height: '650px' }}>
                    {/* Chat Header */}
                    <div className="bg-gradient-to-r from-brand-primary to-brand-primary/90 p-4 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <FiMessageSquare className="text-white text-xl" />
                            <h3 className="text-white font-semibold">AI Writing Assistant</h3>
                        </div>
                        <button
                            onClick={displayAiChat}
                            className="p-2 rounded-full hover:bg-brand-primaryHover transition-colors text-white"
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
                    className="fixed bottom-6 right-6 bg-gradient-to-r from-brand-primary to-brand-primaryHover text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center animate-fade-in transform hover:scale-110"
                    aria-label="Open AI chat"
                >
                    <FiMessageSquare className="h-6 w-6" />
                    <span className="sr-only">Chat with AI</span>
                </button>
            )}
        </div>
    );
};

export default CreatePost;