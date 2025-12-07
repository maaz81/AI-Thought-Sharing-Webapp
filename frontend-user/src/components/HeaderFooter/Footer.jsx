const Footer = () => {
    return (
        <footer className="bg-brand-bg text-brand-text mt-10 dark:bg-brandDark-bg dark:text-brandDark-text border-t border-brand-border dark:border-brandDark-border">
            <div className="container py-6 flex flex-col md:flex-row justify-between items-center text-sm">
                <span>&copy; {new Date().getFullYear()} PostShare. All rights reserved.</span>
                <div className="flex space-x-4 mt-2 md:mt-0">
                    <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className="text-brand-muted hover:text-brand-primary dark:text-brandDark-muted dark:hover:text-brand-primary transition-colors">
                        GitHub
                    </a>
                    <a href="/about" className="text-brand-muted hover:text-brand-primary dark:text-brandDark-muted dark:hover:text-brand-primary transition-colors">
                        About
                    </a>
                    <a href="/contact" className="text-brand-muted hover:text-brand-primary dark:text-brandDark-muted dark:hover:text-brand-primary transition-colors">
                        Contact
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;