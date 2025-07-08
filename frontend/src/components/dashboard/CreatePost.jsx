import { useState } from "react";
import axios from 'axios'

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    const [visibility, setVisibility] = useState("public"); 
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const postData = {
            title,
            content,
            tags: tags.split(",").map(tag => tag.trim()).filter(tag => tag),
            visibility,
        };

        try {
            const response = await axios.post(
                'http://localhost:5000/post/create',
                postData,
                {
                    withCredentials: true
                }
            );

            setStatus(response.status);

            if (response.status === 201 || response.status === 200) {
                setMessage("✅ Post created successfully!");
                setTitle("");
                setContent("");
                setTags("");
                setVisibility("public");
            } else {
                setMessage(`❌ Failed to create post: ${response.data.message || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error creating post:", error.response?.data || error.message);
            setMessage(`❌ Failed to create post: ${error.response?.data?.message || "Network Error"}`);
        }

    };

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Create a New Post</h2>

            <div>
                <label className="block font-medium">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border rounded px-3 py-2 mt-1"
                    required
                />
            </div>

            <div>
                <label className="block font-medium">Content</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full border rounded px-3 py-2 mt-1"
                    rows="4"
                    required
                />
            </div>

            <div>
                <label className="block font-medium">Tags (comma-separated)</label>
                <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full border rounded px-3 py-2 mt-1"
                />
            </div>

             {/* ✅ Visibility Toggle */}
            <div>
                <label className="block font-medium mb-2">Visibility</label>
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => setVisibility("public")}
                        className={`px-4 py-2 rounded ${
                            visibility === "public"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                    >
                        Public
                    </button>
                    <button
                        type="button"
                        onClick={() => setVisibility("private")}
                        className={`px-4 py-2 rounded ${
                            visibility === "private"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                    >
                        Private
                    </button>
                </div>
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Submit
            </button>

            {message && (
                <div className="mt-4 text-sm">
                    <strong>Status:</strong> {status} <br />
                    {message}
                </div>
            )}
        </form>
    );
};

export default CreatePost;
