import React, { useState } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom';


const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [results, setResults] = useState([]); // Keep for compatibility if needed, but mainly use above
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!query.trim()) {
            setResults([]);
            setError('');
            if (onSearch) onSearch(query);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await axios.get('http://localhost:5000/api/search', {
                params: { query },
            });

            console.log('Raw Axios response:', res.data);

            if (res.data.posts || res.data.users) {
                setPosts(res.data.posts || []);
                setUsers(res.data.users || []);
            } else {
                setPosts([]);
                setUsers([]);
            }

            if (onSearch) onSearch(query);
        } catch (err) {
            console.error('Search error:', err.response?.data || err.message);
            setError(
                err.response?.data?.message || 'Something went wrong. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const getSnippet = (content, query) => {
        if (!content) return "";

        const lowerContent = content.toLowerCase();
        const lowerQuery = query.toLowerCase();

        const index = lowerContent.indexOf(lowerQuery);

        // If the word is not found, return first 60 chars
        if (index === -1) {
            return content.substring(0, 60) + (content.length > 60 ? "..." : "");
        }

        // Snippet with 30 chars before and after the keyword
        const start = Math.max(0, index - 30);
        const end = Math.min(content.length, index + query.length + 30);

        let snippet = content.substring(start, end);

        return snippet + "...";
    };

    const highlightText = (text, query) => {
        const regex = new RegExp(`(${query})`, "gi");
        return text.replace(regex, "<mark class='bg-brand-accent text-brand-text font-semibold'>$1</mark>");
    };


    return (
        <div className="max-w-2xl mx-auto dark:bg-brandDark-bg dark:text-brandDark-text">
            <h1 className="text-2xl font-semibold mb-4 text-center text-brand-text dark:text-brandDark-text mt-8">Search Posts</h1>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Search by name, title, or tag"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-4 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-brandDark-surface dark:text-brandDark-text dark:border-brandDark-border"
                />
                <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primaryHover transition-colors"
                >
                    Search
                </button>
            </div>

            {loading && <p className="mt-4 text-brand-primary">Searching...</p>}
            {error && <p className="mt-4 text-state-error">{error}</p>}

            <div className="mt-8">
                {/* Users Section */}
                {users.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-brand-text dark:text-brandDark-text border-b border-brand-border pb-2">Users</h2>
                        <div className="space-y-3">
                            {users.map((user) => (
                                <Link to={`/profile/${user._id}`} key={user._id} className="block">
                                    <div className="flex items-center gap-4 p-4 rounded-xl border border-brand-border bg-brand-surface dark:bg-brandDark-surface dark:border-brandDark-border shadow-sm hover:shadow-md transition-all duration-200">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white font-bold text-lg shadow-sm overflow-hidden shrink-0">
                                            {user.userDetails?.basic_info?.photo ? (
                                                <img src={`http://localhost:5000/uploads/${user.userDetails.basic_info.photo}`} alt={user.username} className="w-full h-full object-cover" />
                                            ) : (
                                                user.username?.[0]?.toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-brand-text dark:text-brandDark-text">{user.username}</h3>
                                            <p className="text-sm text-brand-muted dark:text-brandDark-muted">{user.email}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Posts Section */}
                {posts.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-brand-text dark:text-brandDark-text border-b border-brand-border pb-2">Posts</h2>
                        <ul className="space-y-4">
                            {posts.map((post) => (
                                <Link to={`/post/${post._id}`} key={post._id}>
                                    <li className="border border-brand-border bg-brand-surface dark:bg-brandDark-surface dark:border-brandDark-border p-4 rounded-xl shadow-soft cursor-pointer hover:shadow-md transition-all duration-200 mb-4">
                                        <h3 className="text-lg font-semibold text-brand-text dark:text-brandDark-text">{post.title}</h3>
                                        <p
                                            className="text-sm text-brand-text/80 dark:text-brandDark-text/80 mt-2"
                                            dangerouslySetInnerHTML={{
                                                __html: highlightText(getSnippet(post.content, query), query)
                                            }}
                                        ></p>


                                        {post.tags?.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {post.tags.map((tag, i) => (
                                                    <span
                                                        key={i}
                                                        className="bg-brand-primary/10 text-brand-primary dark:text-brand-primary dark:bg-brand-primary/20 px-2.5 py-1 rounded-full text-xs"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </li>
                                </Link>
                            ))}
                        </ul>
                    </div>
                )}

                {!loading && query.trim() !== "" && posts.length === 0 && users.length === 0 && (
                    <div className="mt-8 text-center py-12 bg-brand-surface/50 dark:bg-brandDark-surface/50 rounded-2xl border border-dashed border-brand-border dark:border-brandDark-border">
                        <p className="text-brand-muted dark:text-brandDark-muted text-lg">
                            No results found for "{query}".
                        </p>
                        <p className="text-sm text-brand-muted/70 dark:text-brandDark-muted/70 mt-2">
                            Try searching for different keywords, usernames, or tags.
                        </p>
                    </div>
                )}
            </div>


        </div>
    );
};

export default SearchBar;