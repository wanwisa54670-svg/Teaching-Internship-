import confetti from 'canvas-confetti';

/**
 * Triggers a celebratory confetti effect
 */
export function triggerCelebration(options?: { count?: number; spread?: number }) {
  try {
    confetti({
      particleCount: options?.count ?? 60,
      spread: options?.spread ?? 70,
      origin: { y: 0.7 },
      colors: ['#1e3a8a', '#006398', '#10b981', '#f59e0b', '#8b5cf6'],
    });
  } catch (e) {
    console.warn('Confetti effect unavailable:', e);
  }
}

/**
 * Formats bytes to human-readable size
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export interface ProcessedFile {
  name: string;
  size: string;
  type: string;
  dataUrl: string;
  isPdf: boolean;
  isImage: boolean;
}

/**
 * Reads and optionally compresses an uploaded file (Image or PDF)
 */
export async function processUploadedFile(file: File): Promise<ProcessedFile> {
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  const isImage = file.type.startsWith('image/');

  if (isPdf) {
    // Read PDF as Data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          name: file.name,
          size: formatBytes(file.size),
          type: 'application/pdf',
          dataUrl: reader.result as string,
          isPdf: true,
          isImage: false,
        });
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  if (isImage) {
    // Compress and resize image to avoid bloating Firestore 1MB document limit
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDimension = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const quality = 0.82;
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            // Calculate approximate size from base64 string
            const approxBytes = Math.round((compressedDataUrl.length * 3) / 4);
            resolve({
              name: file.name.replace(/\.[^/.]+$/, '') + '.jpg',
              size: formatBytes(approxBytes),
              type: 'image/jpeg',
              dataUrl: compressedDataUrl,
              isPdf: false,
              isImage: true,
            });
            return;
          }
          // Fallback if canvas context fails
          resolve({
            name: file.name,
            size: formatBytes(file.size),
            type: file.type || 'image/jpeg',
            dataUrl: (e.target?.result as string) || '',
            isPdf: false,
            isImage: true,
          });
        };
        img.onerror = () => {
          resolve({
            name: file.name,
            size: formatBytes(file.size),
            type: file.type || 'image/jpeg',
            dataUrl: (e.target?.result as string) || '',
            isPdf: false,
            isImage: true,
          });
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  // Fallback for other documents
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        name: file.name,
        size: formatBytes(file.size),
        type: file.type || 'application/octet-stream',
        dataUrl: reader.result as string,
        isPdf: false,
        isImage: false,
      });
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Downloads or opens a base64 / URL file
 */
export function openOrDownloadFile(url: string, fileName = 'document.pdf') {
  try {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    console.error('Failed to download file:', err);
    window.open(url, '_blank');
  }
}
