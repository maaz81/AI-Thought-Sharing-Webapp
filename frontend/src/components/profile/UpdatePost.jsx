// Update.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdatePost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/profile/post/${id}`, {
                    withCredentials: true
                });
                setPost(res.data);
            } catch (err) {
                console.error('Error fetching post:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:5000/profile/post/${id}`, post, {
                withCredentials: true
            });
            navigate('/profile');
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    const confirmCancel = () => {
        const confirm = window.confirm('Are you sure you want to cancel editing this post? Unsaved changes will be lost.');
        if (confirm) {
            navigate('/profile');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!post) return <p>Post not found</p>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Edit Post</h2>
            <input
                type="text"
                className="w-full border p-2 rounded mb-4"
                value={post.title}
                onChange={(e) => setPost({ ...post, title: e.target.value })}
            />
            <textarea
                className="w-full border p-2 rounded mb-4"
                rows={5}
                value={post.content}
                onChange={(e) => setPost({ ...post, content: e.target.value })}
            />
            <input
                type="text"
                className="w-full border p-2 rounded mb-4"
                value={post.tags.join(', ')}
                onChange={(e) =>
                    setPost({ ...post, tags: e.target.value.split(',').map(tag => tag.trim()) })
                }
            />
            <button
                onClick={handleUpdate}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
                Save Changes
            </button>
            <button
                onClick={confirmCancel}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded ml-3"
            >
                Cancel
            </button>
        </div>
    );
};

export default UpdatePost;
