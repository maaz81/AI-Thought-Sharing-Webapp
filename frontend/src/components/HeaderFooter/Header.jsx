import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="bg-blue-600 text-white shadow-md">
            <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
                <Link to="/" className="text-2xl font-bold">
                    📝 PostShare
                </Link>
                <nav className="space-x-4">
                    <Link to="/" className="hover:underline">Home</Link>
                    <Link to="/profile/post" className="hover:underline">Create Post</Link>
                    {/* Add more nav links as needed */}
                </nav>
            </div>
        </header>
    );
};

export default Header;
