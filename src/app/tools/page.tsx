'use client';

import { BlogNavigation } from '@/components/blog-navigation';
import { Download, ImageIcon, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

export default function ToolsPage() {
  const [image, setImage] = useState<string | null>(null);
  const [filename, setFilename] = useState('image.png');
  const [mimeType, setMimeType] = useState('image/png');
  const dropRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleImage = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const ext = file.name.split('.').pop() || 'png';
    setFilename(`image.${ext}`);
    setMimeType(file.type);
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            handleImage(file);
            e.preventDefault();
            return;
          }
        }
      }
    },
    [handleImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleImage(file);
    },
    [handleImage]
  );

  const handleDownload = () => {
    if (!image) return;
    const a = document.createElement('a');
    a.href = image;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const clear = () => {
    setImage(null);
    setFilename('image.png');
    setMimeType('image/png');
  };

  return (
    <>
      <BlogNavigation />
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-semibold text-base text-[var(--foreground)]">
            Paste to Download
          </h1>
          <p className="text-sm text-[var(--foreground)]/50 mt-1">
            Paste or drop an image, then download it.
          </p>
        </div>

        {image ? (
          <div className="flex flex-col gap-3">
            <div className="relative rounded-xl border border-[var(--foreground)]/10 overflow-hidden bg-[var(--foreground)]/5">
              <button
                onClick={clear}
                className="absolute top-2 right-2 p-1 rounded-md bg-[var(--background)]/80 text-[var(--foreground)]/60 hover:text-[var(--foreground)] backdrop-blur-sm transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt="Pasted image"
                className="w-full max-h-96 object-contain"
              />
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="flex-1 px-3 py-2 text-sm rounded-lg bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 text-[var(--foreground)] placeholder:text-[var(--foreground)]/30 focus:outline-none focus:border-[var(--foreground)]/30 transition-colors"
              />
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-opacity"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
            <p className="text-xs text-[var(--foreground)]/30">{mimeType}</p>
          </div>
        ) : (
          <div
            ref={dropRef}
            onPaste={handlePaste}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            tabIndex={0}
            className={`flex flex-col items-center justify-center gap-3 h-64 rounded-xl border-2 border-dashed transition-colors cursor-pointer focus:outline-none ${
              dragging
                ? 'border-[var(--foreground)]/40 bg-[var(--foreground)]/10'
                : 'border-[var(--foreground)]/10 bg-[var(--foreground)]/[0.02] hover:border-[var(--foreground)]/20'
            }`}
          >
            <ImageIcon className="w-8 h-8 text-[var(--foreground)]/20" />
            <p className="text-sm text-[var(--foreground)]/40">
              Paste an image (Ctrl+V) or drag and drop
            </p>
          </div>
        )}
      </div>
    </>
  );
}
