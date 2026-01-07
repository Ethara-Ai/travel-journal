import { useState } from "react";
import {
  Download,
  Share2,
  Copy,
  Check,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Link,
  FileText,
  Image as ImageIcon,
  X,
} from "lucide-react";

/**
 * ExportShare - A reusable export and share component
 * 
 * @param {object} data - Data to export/share
 * @param {string} title - Title for sharing
 * @param {string} description - Description for sharing
 * @param {string} url - URL to share
 * @param {boolean} darkMode - Theme mode
 * @param {function} onExportPDF - Custom PDF export handler
 * @param {function} onExportJSON - Custom JSON export handler
 * @param {function} onExportImage - Custom image export handler
 * @param {boolean} showExportOptions - Show export dropdown
 * @param {boolean} showShareOptions - Show share buttons
 * @param {string} className - Additional CSS classes
 */
const ExportShare = ({
  data,
  title = "Check this out!",
  description = "",
  url = typeof window !== "undefined" ? window.location.href : "",
  darkMode = false,
  onExportPDF,
  onExportJSON,
  onExportImage,
  showExportOptions = true,
  showShareOptions = true,
  className = "",
}) => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleExportJSON = () => {
    if (onExportJSON) {
      onExportJSON(data);
    } else {
      const dataStr = JSON.stringify(data, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title.replace(/\s+/g, "_")}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    setIsExportOpen(false);
  };

  const handleShare = (platform) => {
    const encodedTitle = encodeURIComponent(title);
    const encodedDesc = encodeURIComponent(description);
    const encodedUrl = encodeURIComponent(url);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedDesc}%0A%0A${encodedUrl}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
    setIsShareOpen(false);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    }
    setIsShareOpen(false);
  };

  const buttonBaseClass = `cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 border-2`;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Export Button */}
      {showExportOptions && (
        <div className="relative">
          <button
            onClick={() => {
              setIsExportOpen(!isExportOpen);
              setIsShareOpen(false);
            }}
            className={`${buttonBaseClass} ${
              darkMode
                ? "bg-gray-800/80 border-gray-600 text-gray-200 hover:border-sky-500 hover:text-sky-400"
                : "bg-white border-gray-200 text-gray-700 hover:border-sky-400 hover:text-sky-600"
            }`}
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>

          {/* Export Dropdown */}
          {isExportOpen && (
            <div
              className={`absolute right-0 mt-2 w-48 rounded-xl border-2 shadow-xl overflow-hidden z-50 ${
                darkMode
                  ? "bg-gray-800/95 border-gray-600/80"
                  : "bg-white/95 border-gray-200/80"
              }`}
            >
              <div className="py-1">
                {onExportPDF && (
                  <button
                    onClick={() => {
                      onExportPDF(data);
                      setIsExportOpen(false);
                    }}
                    className={`cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      darkMode
                        ? "text-gray-200 hover:bg-gray-700/80 hover:text-sky-300"
                        : "text-gray-700 hover:bg-sky-50 hover:text-sky-600"
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    Export as PDF
                  </button>
                )}
                <button
                  onClick={handleExportJSON}
                  className={`cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    darkMode
                      ? "text-gray-200 hover:bg-gray-700/80 hover:text-sky-300"
                      : "text-gray-700 hover:bg-sky-50 hover:text-sky-600"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Export as JSON
                </button>
                {onExportImage && (
                  <button
                    onClick={() => {
                      onExportImage(data);
                      setIsExportOpen(false);
                    }}
                    className={`cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      darkMode
                        ? "text-gray-200 hover:bg-gray-700/80 hover:text-sky-300"
                        : "text-gray-700 hover:bg-sky-50 hover:text-sky-600"
                    }`}
                  >
                    <ImageIcon className="h-4 w-4" />
                    Export as Image
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Share Button */}
      {showShareOptions && (
        <div className="relative">
          <button
            onClick={() => {
              setIsShareOpen(!isShareOpen);
              setIsExportOpen(false);
            }}
            className={`${buttonBaseClass} ${
              darkMode
                ? "bg-gradient-to-r from-sky-600 to-indigo-600 border-transparent text-white hover:from-sky-500 hover:to-indigo-500"
                : "bg-gradient-to-r from-sky-500 to-indigo-500 border-transparent text-white hover:from-sky-600 hover:to-indigo-600"
            }`}
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>

          {/* Share Dropdown */}
          {isShareOpen && (
            <div
              className={`absolute right-0 mt-2 w-56 rounded-xl border-2 shadow-xl overflow-hidden z-50 ${
                darkMode
                  ? "bg-gray-800/95 border-gray-600/80"
                  : "bg-white/95 border-gray-200/80"
              }`}
            >
              <div className="py-1">
                {/* Native Share (if supported) */}
                {typeof navigator !== "undefined" && navigator.share && (
                  <button
                    onClick={handleNativeShare}
                    className={`cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      darkMode
                        ? "text-gray-200 hover:bg-gray-700/80 hover:text-sky-300"
                        : "text-gray-700 hover:bg-sky-50 hover:text-sky-600"
                    }`}
                  >
                    <Share2 className="h-4 w-4" />
                    Share via...
                  </button>
                )}

                {/* Copy Link */}
                <button
                  onClick={handleCopyLink}
                  className={`cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    darkMode
                      ? "text-gray-200 hover:bg-gray-700/80 hover:text-sky-300"
                      : "text-gray-700 hover:bg-sky-50 hover:text-sky-600"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span className="text-emerald-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Link className="h-4 w-4" />
                      Copy Link
                    </>
                  )}
                </button>

                <div
                  className={`my-1 border-t ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                />

                {/* Social Platforms */}
                <button
                  onClick={() => handleShare("twitter")}
                  className={`cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    darkMode
                      ? "text-gray-200 hover:bg-gray-700/80 hover:text-sky-300"
                      : "text-gray-700 hover:bg-sky-50 hover:text-sky-600"
                  }`}
                >
                  <Twitter className="h-4 w-4" />
                  Share on Twitter
                </button>
                <button
                  onClick={() => handleShare("facebook")}
                  className={`cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    darkMode
                      ? "text-gray-200 hover:bg-gray-700/80 hover:text-sky-300"
                      : "text-gray-700 hover:bg-sky-50 hover:text-sky-600"
                  }`}
                >
                  <Facebook className="h-4 w-4" />
                  Share on Facebook
                </button>
                <button
                  onClick={() => handleShare("linkedin")}
                  className={`cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    darkMode
                      ? "text-gray-200 hover:bg-gray-700/80 hover:text-sky-300"
                      : "text-gray-700 hover:bg-sky-50 hover:text-sky-600"
                  }`}
                >
                  <Linkedin className="h-4 w-4" />
                  Share on LinkedIn
                </button>
                <button
                  onClick={() => handleShare("email")}
                  className={`cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    darkMode
                      ? "text-gray-200 hover:bg-gray-700/80 hover:text-sky-300"
                      : "text-gray-700 hover:bg-sky-50 hover:text-sky-600"
                  }`}
                >
                  <Mail className="h-4 w-4" />
                  Share via Email
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * ShareButton - Simple share button that triggers native share
 */
export const ShareButton = ({ title, text, url, darkMode, className = "" }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Copy failed:", err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`cursor-pointer p-2.5 rounded-full transition-all duration-300 ${
        darkMode
          ? "bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-sky-400"
          : "bg-white text-gray-600 hover:bg-gray-100 hover:text-sky-600"
      } shadow-md hover:shadow-lg ${className}`}
      aria-label="Share"
    >
      <Share2 className="h-5 w-5" />
    </button>
  );
};

export default ExportShare;

