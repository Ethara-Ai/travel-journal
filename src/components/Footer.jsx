const Footer = ({ darkMode }) => {
  return (
    <footer
      className={`py-8 px-8 text-center backdrop-blur-sm ${
        darkMode
          ? "text-gray-400 bg-gray-800/60 border-gray-700/70"
          : "text-gray-500 bg-white/70 border-gray-200/70"
      } border-t transition-colors duration-300 mt-16`}
    >
      <div className="max-w-5xl mx-auto">
        <p className="text-sm">
          © {new Date().getFullYear()} Travel Journal. Crafted with passion.
        </p>
        <p className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
          Modern UI & Rich Features Demo
        </p>
      </div>
    </footer>
  );
};

export default Footer;

