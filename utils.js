// --- utils.js ---

// Utility: Format file size to human-readable string
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Utility: Get FontAwesome icon class based on MIME type
export const getFileIcon = (mimeType) => {
    if (!mimeType) return 'fa-solid fa-file';
    if (mimeType.startsWith('image/')) return 'fa-solid fa-file-image';
    if (mimeType.startsWith('video/')) return 'fa-solid fa-file-video';
    if (mimeType === 'application/pdf') return 'fa-solid fa-file-pdf';
    if (mimeType.startsWith('audio/')) return 'fa-solid fa-file-audio';
    return 'fa-solid fa-file';
};

// Utility: Force download a file
export const forceDownload = (url, filename, showToast) => {
    showToast(`Downloading ${filename}...`, 'info');
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(blobUrl);
            a.remove();
            showToast(`Downloaded ${filename} successfully.`, 'success');
        })
        .catch(() => showToast('Could not download file.', 'error'));
};
