import { useState } from "react";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";

/**
 * Avatar size classes configuration
 */
const sizeClasses = {
  small: "w-8 h-8 text-xs",
  default: "w-10 h-10 text-sm",
  large: "w-14 h-14 text-lg",
  xlarge: "w-20 h-20 text-2xl",
};

const statusSizeClasses = {
  small: "w-2 h-2",
  default: "w-3 h-3",
  large: "w-4 h-4",
  xlarge: "w-5 h-5",
};

/**
 * AvatarContent Component - Extracted to prevent recreation on each render
 *
 * @param {object} props
 * @param {object} props.user - User object
 * @param {string} props.size - Avatar size
 * @param {boolean} props.darkMode - Theme mode
 * @param {boolean} props.showDropdown - Whether dropdown is shown
 * @param {boolean} props.showOnlineStatus - Show online indicator
 * @param {boolean} props.isOnline - Online status
 * @param {string} props.initials - User initials
 */
const AvatarContent = ({ user, size, darkMode, showDropdown, showOnlineStatus, isOnline, initials }) => (
  <div
    className={`relative ${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center font-semibold transition-all duration-300 ${
      user.avatar
        ? ""
        : darkMode
          ? "bg-gradient-to-br from-sky-600 to-indigo-600 text-white"
          : "bg-gradient-to-br from-sky-500 to-indigo-500 text-white"
    } ${showDropdown ? "cursor-pointer" : ""}`}
  >
    {user.avatar ? (
      <img src={user.avatar} alt={user.name || "User avatar"} className="w-full h-full object-cover" />
    ) : (
      <span>{initials}</span>
    )}

    {/* Online Status Indicator */}
    {showOnlineStatus && (
      <div
        className={`absolute bottom-0 right-0 ${statusSizeClasses[size]} rounded-full border-2 ${
          darkMode ? "border-gray-800" : "border-white"
        } ${isOnline ? "bg-emerald-500" : "bg-gray-400"}`}
      />
    )}
  </div>
);

/**
 * UserAvatar - A reusable user profile/avatar component
 *
 * @param {object} user - User object { name, email, avatar, initials }
 * @param {boolean} darkMode - Theme mode
 * @param {string} size - "small" | "default" | "large" | "xlarge"
 * @param {boolean} showDropdown - Show dropdown menu on click
 * @param {function} onProfileClick - Callback for profile click
 * @param {function} onSettingsClick - Callback for settings click
 * @param {function} onLogoutClick - Callback for logout click
 * @param {Array} menuItems - Custom menu items [{ icon, label, onClick }]
 * @param {boolean} showOnlineStatus - Show online indicator
 * @param {boolean} isOnline - Online status
 * @param {string} className - Additional CSS classes
 */
const UserAvatar = ({
  user = {},
  darkMode = false,
  size = "default",
  showDropdown = false,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
  menuItems = [],
  showOnlineStatus = false,
  isOnline = true,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = user.initials || getInitials(user.name);

  const handleMenuClick = (action) => {
    action?.();
    setIsOpen(false);
  };

  const avatarProps = {
    user,
    size,
    darkMode,
    showDropdown,
    showOnlineStatus,
    isOnline,
    initials,
  };

  if (!showDropdown) {
    return (
      <div className={className}>
        <AvatarContent {...avatarProps} />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 p-1.5 rounded-full transition-all duration-300 cursor-pointer ${
          darkMode ? "hover:bg-gray-700/60" : "hover:bg-gray-100"
        }`}
      >
        <AvatarContent {...avatarProps} />
        {user.name && (
          <div className="hidden sm:flex items-center gap-1">
            <span className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
              {user.name.split(" ")[0]}
            </span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""} ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Menu */}
          <div
            className={`absolute right-0 mt-2 w-64 rounded-xl border-2 shadow-xl overflow-hidden z-50 ${
              darkMode ? "bg-gray-800/95 border-gray-600/80" : "bg-white/95 border-gray-200/80"
            }`}
          >
            {/* User Info Header */}
            <div className={`px-4 py-3 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              <div className="flex items-center gap-3">
                <div className={`${sizeClasses.default} rounded-full overflow-hidden flex-shrink-0`}>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center text-sm font-semibold ${
                        darkMode
                          ? "bg-gradient-to-br from-sky-600 to-indigo-600 text-white"
                          : "bg-gradient-to-br from-sky-500 to-indigo-500 text-white"
                      }`}
                    >
                      {initials}
                    </div>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <p className={`font-medium truncate ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                    {user.name || "User"}
                  </p>
                  {user.email && (
                    <p className={`text-xs truncate ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{user.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              {onProfileClick && (
                <button
                  onClick={() => handleMenuClick(onProfileClick)}
                  className={`cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    darkMode
                      ? "text-gray-200 hover:bg-gray-700/80 hover:text-sky-300"
                      : "text-gray-700 hover:bg-sky-50 hover:text-sky-600"
                  }`}
                >
                  <User className="h-4 w-4" />
                  View Profile
                </button>
              )}

              {onSettingsClick && (
                <button
                  onClick={() => handleMenuClick(onSettingsClick)}
                  className={`cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    darkMode
                      ? "text-gray-200 hover:bg-gray-700/80 hover:text-sky-300"
                      : "text-gray-700 hover:bg-sky-50 hover:text-sky-600"
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
              )}

              {/* Custom Menu Items */}
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleMenuClick(item.onClick)}
                  className={`cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    darkMode
                      ? "text-gray-200 hover:bg-gray-700/80 hover:text-sky-300"
                      : "text-gray-700 hover:bg-sky-50 hover:text-sky-600"
                  }`}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </button>
              ))}

              {onLogoutClick && (
                <>
                  <div className={`my-1 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`} />
                  <button
                    onClick={() => handleMenuClick(onLogoutClick)}
                    className={`cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      darkMode
                        ? "text-red-400 hover:bg-red-900/30 hover:text-red-300"
                        : "text-red-600 hover:bg-red-50 hover:text-red-700"
                    }`}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/**
 * AvatarGroup - Display multiple avatars in a stack
 */
export const AvatarGroup = ({ users = [], max = 4, size = "default", darkMode = false, className = "" }) => {
  const displayUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  return (
    <div className={`flex items-center -space-x-2 ${className}`}>
      {displayUsers.map((user, index) => (
        <div
          key={index}
          className={`${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center font-semibold border-2 ${
            darkMode ? "border-gray-800" : "border-white"
          } ${
            user.avatar
              ? ""
              : darkMode
                ? "bg-gradient-to-br from-sky-600 to-indigo-600 text-white"
                : "bg-gradient-to-br from-sky-500 to-indigo-500 text-white"
          }`}
          style={{ zIndex: displayUsers.length - index }}
        >
          {user.avatar ? (
            <img src={user.avatar} alt={user.name || "User"} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs">
              {user.initials ||
                (user.name
                  ? user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "?")}
            </span>
          )}
        </div>
      ))}

      {remainingCount > 0 && (
        <div
          className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold border-2 ${
            darkMode ? "border-gray-800 bg-gray-700 text-gray-300" : "border-white bg-gray-200 text-gray-600"
          }`}
          style={{ zIndex: 0 }}
        >
          <span className="text-xs">+{remainingCount}</span>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
