import { Plane, Globe, MapPinned, Star } from "lucide-react";

const TripStats = ({ trips, darkMode }) => {
  const visitedTrips = trips.filter((trip) => !trip.isWishlist);
  const totalCountries = [...new Set(visitedTrips.map((trip) => trip.country))].length;
  const totalContinents = [...new Set(visitedTrips.map((trip) => trip.continent))].length;
  const avgRating =
    visitedTrips.length > 0
      ? (visitedTrips.reduce((sum, trip) => sum + trip.rating, 0) / visitedTrips.length).toFixed(1)
      : "0.0";

  const StatCard = ({ icon: Icon, value, label, colorName }) => {
    const colors = {
      blue: {
        darkBg: "from-blue-900/30 to-gray-800/60",
        lightBg: "from-blue-100/80 to-white/90",
        darkBorder: "border-blue-800/50",
        lightBorder: "border-blue-200/90",
        darkText: "text-blue-300",
        lightText: "text-blue-600",
        darkIconBg: "bg-blue-900/50",
        lightIconBg: "bg-blue-100",
      },
      purple: {
        darkBg: "from-purple-900/30 to-gray-800/60",
        lightBg: "from-purple-100/80 to-white/90",
        darkBorder: "border-purple-800/50",
        lightBorder: "border-purple-200/90",
        darkText: "text-purple-300",
        lightText: "text-purple-600",
        darkIconBg: "bg-purple-900/50",
        lightIconBg: "bg-purple-100",
      },
      pink: {
        darkBg: "from-pink-900/30 to-gray-800/60",
        lightBg: "from-pink-100/80 to-white/90",
        darkBorder: "border-pink-800/50",
        lightBorder: "border-pink-200/90",
        darkText: "text-pink-300",
        lightText: "text-pink-600",
        darkIconBg: "bg-pink-900/50",
        lightIconBg: "bg-pink-100",
      },
      amber: {
        darkBg: "from-amber-900/30 to-gray-800/60",
        lightBg: "from-amber-100/80 to-white/90",
        darkBorder: "border-amber-800/50",
        lightBorder: "border-amber-200/90",
        darkText: "text-amber-300",
        lightText: "text-amber-600",
        darkIconBg: "bg-amber-900/50",
        lightIconBg: "bg-amber-100",
      },
    };
    const c = colors[colorName];

    return (
      <div
        className={`p-5 rounded-2xl border-2 ${
          darkMode
            ? `${c.darkBorder} bg-gradient-to-br ${c.darkBg}`
            : `${c.lightBorder} bg-gradient-to-br ${c.lightBg}`
        } backdrop-blur-sm flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.03] hover:shadow-lg`}
      >
        <div
          className={`p-3 rounded-full mb-2.5 ${
            darkMode ? `${c.darkIconBg} shadow-inner` : `${c.lightIconBg} shadow-sm`
          } transition-all duration-300`}
        >
          <Icon className={`h-6 w-6 ${darkMode ? c.darkText : c.lightText}`} />
        </div>
        <p className={`text-3xl font-extrabold mb-0.5 ${darkMode ? c.darkText : c.lightText}`}>
          {value}
        </p>
        <p
          className={`text-xs font-medium uppercase tracking-wide ${
            darkMode ? "text-gray-200" : `${c.lightText}/90`
          }`}
        >
          {label}
        </p>
      </div>
    );
  };

  if (visitedTrips.length === 0) {
    return (
      <div
        className={`${
          darkMode
            ? "bg-gray-800/80 border-gray-700/70"
            : "bg-white/90 border-gray-200/80"
        } backdrop-blur-xl rounded-3xl shadow-xl p-8 border-2 text-center`}
      >
        <h3
          className={`text-2xl font-bold font-playfair ${
            darkMode ? "text-gray-200" : "text-gray-800"
          } mb-3`}
        >
          Travel Statistics
        </h3>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Once you've added some visited trips, your travel stats will appear here!
        </p>
      </div>
    );
  }

  return (
    <div
      className={`${
        darkMode
          ? "bg-gray-800/80 border-gray-700/70"
          : "bg-white/90 border-gray-200/80"
      } backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border-2 transition-all duration-500 hover:shadow-3xl`}
    >
      <h3
        className={`text-2xl font-bold font-playfair ${
          darkMode ? "text-gray-100" : "text-gray-800"
        } mb-6 flex items-center`}
      >
        <span className="mr-3 text-2xl">🌍</span>
        Travel Statistics
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        <StatCard icon={Plane} value={visitedTrips.length} label="Trips Taken" colorName="blue" />
        <StatCard icon={Globe} value={totalContinents} label="Continents" colorName="purple" />
        <StatCard icon={MapPinned} value={totalCountries} label="Countries" colorName="pink" />
        <StatCard icon={Star} value={`${avgRating}/5`} label="Avg. Rating" colorName="amber" />
      </div>
    </div>
  );
};

export default TripStats;

