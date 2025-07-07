import axios from 'axios';
import React, { useEffect, useState } from 'react';

const ProfilePost = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/profile/post', {
                    withCredentials: true,
                });

                const data = res.data;

                if (Array.isArray(data)) {
                    const enhancedPosts = data
                        .map(post => ({
                            ...post,
                            likes: post.likes || 0,
                            dislikes: post.dislikes || 0,
                            userReaction: null
                        }))
                        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

                    setPosts(enhancedPosts);
                } else {
                    setPosts([]);
                }

            } catch (error) {
                console.error('Error fetching user posts:', error);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, []);

    if (loading) {
        return <p>Loading your posts...</p>;
    }

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Your Posts</h2>
            {posts.length === 0 ? (
                <p>No posts found.</p>
            ) : (
                posts.map((post) => (
                    <div key={post._id} className="border p-4 rounded-xl mb-4 shadow-lg bg-white">
                        <h3 className="text-xl font-semibold text-gray-800">{post.title}</h3>
                        <p className="text-gray-700 my-2">{post.content}</p>
                        <div className="text-sm text-gray-500 mb-3">
                            Tags: {post.tags.join(', ')} | Likes: {post.likes} | Dislikes: {post.dislikes}
                        </div>

                        <div className="flex gap-3">
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition"
                            >
                                Update
                            </button>
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ProfilePost;
