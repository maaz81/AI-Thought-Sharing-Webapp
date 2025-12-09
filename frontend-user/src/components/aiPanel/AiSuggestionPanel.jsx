import React from "react";

const AiSuggestionPanel = ({
  titles = [],
  descriptions = [],
  tags = [],
  reviewSuggestions = [],           // 👈 NEW
  onSelectTitle,
  onSelectDescription,
  onSelectTags,
}) => {
  return (
    <div className="mt-8 space-y-6">

      {/* Suggested Titles */}
      {titles.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">🎯 AI Suggested Titles</h3>
          <ul className="space-y-2">
            {titles.map((title, idx) => (
              <li key={idx} className="flex justify-between items-center bg-gray-100 rounded px-4 py-2">
                <span className="text-sm text-gray-800">{title}</span>
                <button
                  type="button"
                  onClick={() => onSelectTitle && onSelectTitle(title)}
                  className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Use this
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggested Descriptions / Improved Content */}
      {descriptions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">📝 AI Suggested Descriptions / Content</h3>
          <div className="space-y-4">
            {descriptions.map((desc, idx) => (
              <div key={idx} className="bg-gray-100 rounded p-4">
                <p className="text-sm text-gray-700 mb-2 whitespace-pre-line">{desc}</p>
                <button
                  type="button"
                  onClick={() => onSelectDescription && onSelectDescription(desc)}
                  className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Use this
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Tags */}
      {tags.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">🏷️ AI Suggested Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  onSelectTags &&
                  onSelectTags(prev => (prev ? `${prev}, ${tag}` : tag))
                }
                className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded hover:bg-blue-200 transition"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Review Suggestions */}
      {reviewSuggestions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">💡 AI Review Notes</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            {reviewSuggestions.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};

export default AiSuggestionPanel;
