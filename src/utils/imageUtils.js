/**
 * Image utility functions for the Travel Journal app
 * Handles image compression, resizing, and validation
 */

/**
 * Default compression options
 */
const DEFAULT_OPTIONS = {
  maxWidth: 1200,
  maxHeight: 800,
  quality: 0.8,
  mimeType: "image/jpeg",
};

/**
 * Compress and resize an image file
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @param {number} options.maxWidth - Maximum width in pixels (default: 1200)
 * @param {number} options.maxHeight - Maximum height in pixels (default: 800)
 * @param {number} options.quality - JPEG quality 0-1 (default: 0.8)
 * @param {string} options.mimeType - Output mime type (default: "image/jpeg")
 * @returns {Promise<string>} Base64 encoded compressed image
 */
export const compressImage = (file, options = {}) => {
  const { maxWidth, maxHeight, quality, mimeType } = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    // Validate input
    if (!file || !(file instanceof Blob)) {
      reject(new Error("Invalid file provided"));
      return;
    }

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      reject(new Error("File is not an image"));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        try {
          // Calculate new dimensions while maintaining aspect ratio
          const { width, height } = calculateDimensions(img.width, img.height, maxWidth, maxHeight);

          // Create canvas and draw resized image
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Failed to get canvas context"));
            return;
          }

          // Use better image smoothing for quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          // Draw the image
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64
          const compressedBase64 = canvas.toDataURL(mimeType, quality);

          resolve(compressedBase64);
        } catch (error) {
          reject(new Error(`Failed to compress image: ${error.message}`));
        }
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = e.target.result;
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Calculate new dimensions while maintaining aspect ratio
 * @param {number} originalWidth - Original width
 * @param {number} originalHeight - Original height
 * @param {number} maxWidth - Maximum allowed width
 * @param {number} maxHeight - Maximum allowed height
 * @returns {Object} Object with width and height properties
 */
export const calculateDimensions = (originalWidth, originalHeight, maxWidth, maxHeight) => {
  let width = originalWidth;
  let height = originalHeight;

  // Check if resizing is needed
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height };
  }

  // Calculate aspect ratio
  const aspectRatio = width / height;

  // Determine which dimension is the limiting factor
  if (width > maxWidth) {
    width = maxWidth;
    height = Math.round(width / aspectRatio);
  }

  if (height > maxHeight) {
    height = maxHeight;
    width = Math.round(height * aspectRatio);
  }

  return { width, height };
};

/**
 * Get the size of a base64 string in bytes
 * @param {string} base64String - Base64 encoded string
 * @returns {number} Size in bytes
 */
export const getBase64Size = (base64String) => {
  if (!base64String || typeof base64String !== "string") {
    return 0;
  }

  // Remove data URL prefix if present
  const base64 = base64String.includes(",") ? base64String.split(",")[1] : base64String;

  // Calculate size: base64 encodes 3 bytes into 4 characters
  // Padding characters (=) don't represent data
  const padding = (base64.match(/=/g) || []).length;
  return Math.floor((base64.length * 3) / 4) - padding;
};

/**
 * Format bytes to human readable string
 * @param {number} bytes - Number of bytes
 * @param {number} decimals - Decimal places (default: 2)
 * @returns {string} Formatted string (e.g., "1.5 MB")
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

/**
 * Check if an image exceeds the size limit
 * @param {string} base64String - Base64 encoded image
 * @param {number} maxSizeBytes - Maximum allowed size in bytes (default: 1MB)
 * @returns {boolean} True if image exceeds limit
 */
export const exceedsSizeLimit = (base64String, maxSizeBytes = 1024 * 1024) => {
  const size = getBase64Size(base64String);
  return size > maxSizeBytes;
};

/**
 * Validate image file before processing
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 * @param {number} options.maxFileSizeMB - Maximum file size in MB (default: 10)
 * @param {string[]} options.allowedTypes - Allowed MIME types
 * @returns {Object} Validation result with isValid and error properties
 */
export const validateImageFile = (file, options = {}) => {
  const { maxFileSizeMB = 10, allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"] } = options;

  if (!file) {
    return { isValid: false, error: "No file provided" };
  }

  if (!(file instanceof Blob)) {
    return { isValid: false, error: "Invalid file object" };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`,
    };
  }

  const maxSizeBytes = maxFileSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File size exceeds ${maxFileSizeMB}MB limit`,
    };
  }

  return { isValid: true, error: null };
};

/**
 * Create a thumbnail from an image
 * @param {string} base64Image - Base64 encoded image
 * @param {number} size - Thumbnail size (default: 150)
 * @returns {Promise<string>} Base64 encoded thumbnail
 */
export const createThumbnail = (base64Image, size = 150) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");

        // Make square thumbnail
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // Calculate crop dimensions for center crop
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Draw cropped and resized image
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

        const thumbnail = canvas.toDataURL("image/jpeg", 0.7);
        resolve(thumbnail);
      } catch (error) {
        reject(new Error(`Failed to create thumbnail: ${error.message}`));
      }
    };

    img.onerror = () => {
      reject(new Error("Failed to load image for thumbnail"));
    };

    img.src = base64Image;
  });
};

/**
 * Check if a string is a valid base64 image
 * @param {string} str - String to check
 * @returns {boolean} True if valid base64 image
 */
export const isValidBase64Image = (str) => {
  if (!str || typeof str !== "string") {
    return false;
  }

  // Check for data URL format
  const dataUrlRegex = /^data:image\/(jpeg|jpg|png|gif|webp|svg\+xml);base64,/;
  return dataUrlRegex.test(str);
};

/**
 * Get image dimensions from base64 string
 * @param {string} base64Image - Base64 encoded image
 * @returns {Promise<Object>} Object with width and height
 */
export const getImageDimensions = (base64Image) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height,
      });
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = base64Image;
  });
};
