const Footer = () => {
    return (
        <footer className="bg-gray-100 text-gray-700 mt-10">
            <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center text-sm">
                <span>&copy; {new Date().getFullYear()} PostShare. All rights reserved.</span>
                <div className="space-x-4">
                    <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className="hover:underline">
                        GitHub
                    </a>
                    <a href="/about" className="hover:underline">About</a>
                    <a href="/contact" className="hover:underline">Contact</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;