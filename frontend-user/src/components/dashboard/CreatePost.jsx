import { useState } from "react";
import axios from 'axios';
import {
  FiPlus, FiTag, FiLock, FiGlobe, FiCheck,
  FiMessageSquare, FiX
} from "react-icons/fi";
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
  const [aiReviewLoading, setAiReviewLoading] = useState(false);
  const [reviewSuggestions, setReviewSuggestions] = useState([]);

  const [showChat, setShowChat] = useState(false);

  const displayAiChat = () => setShowChat(!showChat);

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
        setMessage({ text: "Post created successfully!", type: "success" });
        setTitle("");
        setContent("");
        setTags("");
        setVisibility("public");
        setWordCount(0);
        setSuggestedTitles([]);
        setSuggestedDescription([]);
        setSuggestedTags([]);
        setReviewSuggestions([]);
      } else {
        setMessage({
          text: response.data.message || "Failed to create post",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Network Error",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetAISuggestions = async () => {
    if (wordCount < 50) return;

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
    } finally {
      setAiLoading(false);
    }
  };

  const handleReviewByAI = async () => {
    if (!title && !content) return;

    try {
      setAiReviewLoading(true);
      const response = await axios.post("http://localhost:5000/api/ai/review", {
        title,
        content,
      });

      const { improvedTitle, improvedContent, suggestions } = response.data;

      if (improvedTitle) {
        setSuggestedTitles(prev => [improvedTitle, ...prev]);
      }
      if (improvedContent) {
        setSuggestedDescription(prev => [improvedContent, ...prev]);
      }
      if (Array.isArray(suggestions)) {
        setReviewSuggestions(suggestions);
      }
    } finally {
      setAiReviewLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg py-8 px-4 sm:px-6 lg:px-8 dark:bg-brandDark-bg dark:text-brandDark-text">

      <div className="max-w-2xl mx-auto">

        {/* Main Card */}
        <div className="bg-brand-surface shadow-soft rounded-2xl overflow-hidden border border-brand-border dark:bg-brandDark-surface dark:border-brandDark-border">

          {/* Header */}
          <div className="bg-gradient-to-r from-brand-primary to-brand-primary/90 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <FiPlus className="mr-3" /> Create New Post
            </h2>
            <p className="text-white/80 mt-2">
              Share your thoughts with the community
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-brandDark-text">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-brand-border rounded-2xl bg-brand-surface dark:bg-brandDark-surface dark:border-brandDark-border dark:text-brandDark-text"
                placeholder="What's your post about?"
                required
              />
            </div>

            {/* Content */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium dark:text-brandDark-text">Content</label>
                <span className="text-xs text-brand-muted dark:text-brandDark-muted">
                  {wordCount} words {wordCount >= 50 ? "✓" : ""}
                </span>
              </div>

              <textarea
                value={content}
                onChange={(e) => {
                  const text = e.target.value;
                  setContent(text);
                  setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
                }}
                className="w-full px-4 py-3 border border-brand-border rounded-2xl bg-brand-surface dark:bg-brandDark-surface dark:border-brandDark-border dark:text-brandDark-text min-h-[200px]"
                placeholder="Write your thoughts here..."
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm font-medium flex items-center mb-2 dark:text-brandDark-text">
                <FiTag className="mr-2" /> Tags
              </label>

              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-3 border border-brand-border rounded-2xl bg-brand-surface dark:bg-brandDark-surface dark:border-brandDark-border dark:text-brandDark-text"
                placeholder="react, javascript, webdev"
              />
            </div>

            {/* AI Buttons */}
            <div className="space-y-3">

              {/* Suggest */}
              <button
                type="button"
                disabled={aiLoading || wordCount < 50}
                onClick={handleGetAISuggestions}
                className={`w-full py-3 rounded-2xl text-white ${
                  aiLoading || wordCount < 50
                    ? "bg-brand-muted dark:bg-brandDark-muted cursor-not-allowed dark:text-brandDark-text"
                    : "bg-gradient-to-r from-state-success to-state-info"
                }`}
              >
                {aiLoading ? "Generating..." : "✨ Get AI Suggestions"}
              </button>

              {/* Review */}
              <button
                type="button"
                disabled={aiReviewLoading || (!title && !content)}
                onClick={handleReviewByAI}
                className={`w-full py-3 rounded-2xl text-white ${
                  aiReviewLoading || (!title && !content)
                    ? "bg-brand-muted dark:bg-brandDark-muted cursor-not-allowed dark:text-brandDark-text"
                    : "bg-gradient-to-r from-brand-primary to-brand-primaryHover"
                }`}
              >
                {aiReviewLoading ? "Reviewing..." : "✅ Review by AI"}
              </button>
            </div>

            {/* Suggestion panel (still inside form) */}
            <AiSuggestionPanel
              titles={suggestedTitles}
              descriptions={suggestedDescription}
              tags={suggestedTags}
              reviewSuggestions={reviewSuggestions}
              onSelectTitle={setTitle}
              onSelectDescription={setContent}
              onSelectTags={setTags}
            />

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium mb-3 dark:text-brandDark-text">Visibility</label>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setVisibility("public")}
                  className={`flex-1 py-3 border rounded-2xl transition-colors ${
                    visibility === "public"
                      ? "border-brand-primary text-brand-primary bg-brand-primary/10 dark:bg-brand-primary/20 dark:border-brand-primary dark:text-brand-primary"
                      : "border-brand-border dark:border-brandDark-border dark:text-brandDark-text"
                  }`}
                >
                  <FiGlobe className="inline mr-2" /> Public
                </button>

                <button
                  type="button"
                  onClick={() => setVisibility("private")}
                  className={`flex-1 py-3 border rounded-2xl transition-colors ${
                    visibility === "private"
                      ? "border-brand-primary text-brand-primary bg-brand-primary/10 dark:bg-brand-primary/20 dark:border-brand-primary dark:text-brand-primary"
                      : "border-brand-border dark:border-brandDark-border dark:text-brandDark-text"
                  }`}
                >
                  <FiLock className="inline mr-2" /> Private
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 text-white rounded-2xl transition-all ${
                isSubmitting
                  ? "bg-brand-primary/60 dark:bg-brand-primary/40 cursor-not-allowed"
                  : "bg-gradient-to-r from-brand-primary to-brand-primaryHover hover:shadow-lg"
              }`}
            >
              {isSubmitting ? "Publishing..." : "Publish Post"}
            </button>

            {/* Status Message */}
            {message.text && (
              <div
                className={`p-4 rounded-xl border ${
                  message.type === "success"
                    ? "border-state-success bg-state-success/10 text-state-success dark:bg-state-success/20"
                    : "border-state-error bg-state-error/10 text-state-error dark:bg-state-error/20"
                }`}
              >
                {message.text}
              </div>
            )}
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-brand-muted dark:text-brandDark-muted">
          Your post will be visible to{" "}
          {visibility === "public" ? "everyone" : "only you"}.
        </p>

      </div>

      {/* Floating Chat */}
      {showChat ? (
        <div className="fixed bottom-6 right-6 max-w-md w-full h-[650px] bg-brand-surface dark:bg-brandDark-surface shadow-xl rounded-2xl border border-brand-border dark:border-brandDark-border flex flex-col">
          <div className="bg-gradient-to-r from-brand-primary to-brand-primary/90 p-4 flex justify-between">
            <div className="text-white font-semibold flex items-center">
              <FiMessageSquare className="mr-2" /> AI Writing Assistant
            </div>
            <button onClick={displayAiChat} className="text-white">
              <FiX />
            </button>
          </div>

          <div className="p-4 overflow-y-auto flex-1">
            <AIChatbot />
          </div>
        </div>
      ) : (
        <button
          onClick={displayAiChat}
          className="fixed bottom-6 right-6 bg-brand-primary text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-300 hover:shadow-xl"
        >
          <FiMessageSquare className="h-6 w-6" />
        </button>
      )}

    </div>
  );
};

export default CreatePost;