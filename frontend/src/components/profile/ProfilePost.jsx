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
                    <div key={post._id} className="border p-3 rounded mb-2 shadow">
                        <h3 className="text-lg font-semibold">{post.title}</h3>
                        <p>{post.content}</p>
                        <div className="text-sm text-gray-600">
                            Tags: {post.tags.join(', ')} | Likes: {post.likes} | Dislikes: {post.dislikes}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ProfilePost;
