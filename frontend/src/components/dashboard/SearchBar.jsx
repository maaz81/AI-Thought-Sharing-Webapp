import React, { useState } from 'react';
import axios from 'axios'
const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await axios.get(`http://localhost:5000/search?query=${encodeURIComponent(query)}`);
            setResults(Array.isArray(res.data.results) ? res.data.results : []);
            console.log('Raw Axios response:', res.data);

        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSearch();
    };


    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4 text-center">Search Posts</h1>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Search by name, title, or tag"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                    Search
                </button>
            </div>

            {loading && <p className="mt-4 text-blue-600">Searching...</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}

            <ul className="mt-6 space-y-4">
                {Array.isArray(results) && results.length > 0 ? (
                    results.map((post) => (
                        <li key={post._id} className="border p-4 rounded-md shadow-sm">
                            <h3 className="text-lg font-semibold">{post.title}</h3>
                            <p className="text-md ">{post.content}</p>
                            {post.tags?.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {post.tags.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </li>
                    ))
                ) : (
                    !loading &&
                    query &&
                    <p className="mt-4 text-gray-500">No results found for "{query}".</p>
                )}
            </ul>


        </div>
    );
};

export default SearchBar;
