const InfoCard = ({ icon: Icon, title, value, darkMode, color, className = "" }) => {
  return (
    <div
      className={`flex flex-col items-center rounded-xl p-4 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl ${
        darkMode
          ? "bg-gray-800/70 border-gray-700 hover:border-gray-600"
          : "bg-white/80 border-gray-200 hover:border-gray-300"
      } backdrop-blur-lg border ${className}`}
    >
      <div
        className="p-3 rounded-full mb-3 transition-colors duration-300"
        style={{ backgroundColor: `${color}2A` }}
      >
        <Icon className="h-6 w-6" style={{ color }} />
      </div>
      <p
        className={`text-xs uppercase font-semibold mb-1 tracking-wider ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {title}
      </p>
      <div
        className={`text-center font-semibold text-lg ${
          darkMode ? "text-gray-100" : "text-gray-800"
        }`}
      >
        {value}
      </div>
    </div>
  );
};

export default InfoCard;

