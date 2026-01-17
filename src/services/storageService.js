// Alternative File Service (without Firebase Storage)
// Files will be handled using URL links instead of actual uploads

/**
 * Mock upload - Store file metadata without actual upload
 * @param {File} file - The file to upload
 * @param {string} path - Storage path (ignored for now)
 * @param {Function} onProgress - Callback for upload progress (0-100)
 * @returns {Promise<{url: string, path: string}>}
 */
export const uploadFile = async (file, path, onProgress = null) => {
  return new Promise((resolve, reject) => {
    try {
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        if (onProgress) {
          onProgress(Math.min(progress, 100));
        }
        if (progress >= 100) {
          clearInterval(interval);
          
          // Create a local object URL for preview
          const localUrl = URL.createObjectURL(file);
          
          // Return metadata without actual upload
          resolve({
            url: localUrl, // Local URL for preview
            path: `${path}${file.name}`,
            name: `${Date.now()}_${file.name}`,
            originalName: file.name,
            size: file.size,
            type: file.type,
            note: 'File stored locally - Firebase Storage not enabled'
          });
        }
      }, 200);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Delete a file (not implemented without Firebase Storage)
 * @param {string} filePath - The full path to the file in storage
 * @returns {Promise<void>}
 */
export const deleteFile = async (filePath) => {
  try {
    console.log('Delete file:', filePath);
    // File deletion not available without Firebase Storage
    return Promise.resolve();
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Get file extension from filename
 * @param {string} filename
 * @returns {string}
 */
export const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

/**
 * Format file size for display
 * @param {number} bytes
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Validate file type
 * @param {File} file
 * @param {string[]} allowedTypes - e.g., ['pdf', 'doc', 'docx']
 * @returns {boolean}
 */
export const validateFileType = (file, allowedTypes) => {
  const extension = getFileExtension(file.name).toLowerCase();
  return allowedTypes.includes(extension);
};

/**
 * Validate file size
 * @param {File} file
 * @param {number} maxSizeMB - Maximum file size in MB
 * @returns {boolean}
 */
export const validateFileSize = (file, maxSizeMB) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};
