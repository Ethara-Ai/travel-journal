import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Download, Maximize2 } from "lucide-react";

/**
 * ImageGallery - A reusable image gallery component with lightbox
 * 
 * @param {Array} images - Array of image objects { src, alt, caption }
 * @param {boolean} darkMode - Theme mode
 * @param {string} layout - "grid" | "masonry" | "carousel"
 * @param {number} columns - Number of columns for grid layout
 * @param {boolean} showThumbnails - Show thumbnail navigation
 * @param {boolean} autoPlay - Auto-play carousel
 * @param {number} autoPlayInterval - Auto-play interval in ms
 * @param {string} className - Additional CSS classes
 */
const ImageGallery = ({
  images = [],
  darkMode = false,
  layout = "grid",
  columns = 3,
  showThumbnails = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  className = "",
}) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const openLightbox = (index) => {
    setSelectedIndex(index);
    setIsZoomed(false);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    setIsZoomed(false);
  };

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setIsZoomed(false);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setIsZoomed(false);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, goToPrevious, goToNext]);

  // Auto-play for carousel
  useEffect(() => {
    if (!autoPlay || selectedIndex === null) return;

    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, selectedIndex, goToNext]);

  const gridColsClass = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
  };

  if (images.length === 0) {
    return (
      <div
        className={`flex items-center justify-center p-8 rounded-xl border-2 border-dashed ${
          darkMode
            ? "bg-gray-800/50 border-gray-600 text-gray-400"
            : "bg-gray-50 border-gray-300 text-gray-500"
        }`}
      >
        No images to display
      </div>
    );
  }

  return (
    <>
      {/* Gallery Grid */}
      <div
        className={`grid ${gridColsClass[columns] || "grid-cols-3"} gap-4 ${className}`}
      >
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => openLightbox(index)}
            className={`relative group cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl ${
              darkMode ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <img
              src={image.src}
              alt={image.alt || `Image ${index + 1}`}
              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Overlay */}
            <div
              className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                darkMode ? "bg-black/60" : "bg-black/40"
              }`}
            >
              <ZoomIn className="h-8 w-8 text-white" />
            </div>

            {/* Caption */}
            {image.caption && (
              <div
                className={`absolute bottom-0 left-0 right-0 p-3 ${
                  darkMode ? "bg-gray-900/90" : "bg-white/90"
                } backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300`}
              >
                <p
                  className={`text-sm truncate ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {image.caption}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-opacityIn"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Toolbar */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(!isZoomed);
              }}
              className="p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label={isZoomed ? "Zoom out" : "Zoom in"}
            >
              {isZoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
            </button>
            <span className="text-white text-sm">
              {selectedIndex + 1} / {images.length}
            </span>
            <a
              href={images[selectedIndex]?.src}
              download
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Download image"
            >
              <Download className="h-5 w-5" />
            </a>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          {/* Main Image */}
          <div
            className={`max-w-[90vw] max-h-[80vh] transition-transform duration-300 ${
              isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(!isZoomed);
            }}
          >
            <img
              src={images[selectedIndex]?.src}
              alt={images[selectedIndex]?.alt || `Image ${selectedIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Caption */}
          {images[selectedIndex]?.caption && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-xl px-6 py-3">
              <p className="text-white text-center">{images[selectedIndex].caption}</p>
            </div>
          )}

          {/* Thumbnails */}
          {showThumbnails && images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 backdrop-blur-sm rounded-xl p-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex(index);
                    setIsZoomed(false);
                  }}
                  className={`w-12 h-12 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${
                    index === selectedIndex
                      ? "ring-2 ring-sky-500 scale-110"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.alt || `Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

/**
 * SingleImageViewer - View single image with zoom
 */
export const SingleImageViewer = ({ src, alt, darkMode, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className={`relative group cursor-pointer overflow-hidden rounded-xl ${className}`}
      >
        <img src={src} alt={alt} className="w-full h-full object-cover" />
        <div
          className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            darkMode ? "bg-black/60" : "bg-black/40"
          }`}
        >
          <Maximize2 className="h-8 w-8 text-white" />
        </div>
      </div>

      {isOpen && (
        <ImageGallery
          images={[{ src, alt }]}
          darkMode={darkMode}
          showThumbnails={false}
        />
      )}
    </>
  );
};

export default ImageGallery;

