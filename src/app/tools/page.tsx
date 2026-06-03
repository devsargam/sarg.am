'use client';

import { BlogNavigation } from '@/components/blog-navigation';
import {
  AlertCircle,
  Download,
  FileKey2,
  ImageIcon,
  KeyRound,
  LockKeyhole,
  Upload,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const ENCRYPTED_EXTENSION = '.sargimg';
const ENCRYPTED_MIME_TYPE = 'application/vnd.sargam.encrypted-image+json';
const KDF_ITERATIONS = 250_000;

type SelectedImage = {
  file: File;
  previewUrl: string;
};

type DecryptedImage = {
  blob: Blob;
  filename: string;
  mimeType: string;
  previewUrl: string;
};

type EncryptedImagePayload = {
  version: 1;
  algorithm: 'AES-GCM';
  kdf: 'PBKDF2-SHA-256';
  iterations: number;
  salt: string;
  iv: string;
  name: string;
  type: string;
  size: number;
  encryptedAt: string;
  data: string;
};

function bytesToBase64(bytes: Uint8Array) {
  let binary = '';
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  return btoa(binary);
}

function base64ToBytes(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

function stripExtension(filename: string) {
  return filename.replace(/\.[^/.]+$/, '') || 'image';
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;

  const units = ['KB', 'MB', 'GB'];
  let value = bytes / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function getWebCrypto() {
  if (!globalThis.crypto?.subtle || !globalThis.crypto.getRandomValues) {
    throw new Error('Web Crypto is not available in this browser.');
  }

  return globalThis.crypto;
}

async function deriveKey(password: string, salt: Uint8Array, keyUsages: KeyUsage[]) {
  const webCrypto = getWebCrypto();
  const keyMaterial = await webCrypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return webCrypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: KDF_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    {
      name: 'AES-GCM',
      length: 256,
    },
    false,
    keyUsages
  );
}

async function encryptImage(file: File, password: string) {
  const webCrypto = getWebCrypto();
  const salt = webCrypto.getRandomValues(new Uint8Array(16));
  const iv = webCrypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt, ['encrypt']);
  const encrypted = await webCrypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    await file.arrayBuffer()
  );

  const payload: EncryptedImagePayload = {
    version: 1,
    algorithm: 'AES-GCM',
    kdf: 'PBKDF2-SHA-256',
    iterations: KDF_ITERATIONS,
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    name: file.name,
    type: file.type || 'application/octet-stream',
    size: file.size,
    encryptedAt: new Date().toISOString(),
    data: bytesToBase64(new Uint8Array(encrypted)),
  };

  return new Blob([JSON.stringify(payload, null, 2)], {
    type: ENCRYPTED_MIME_TYPE,
  });
}

function assertEncryptedPayload(value: unknown): asserts value is EncryptedImagePayload {
  if (!value || typeof value !== 'object') {
    throw new Error('This is not an encrypted image file.');
  }

  const payload = value as Partial<EncryptedImagePayload>;
  const hasExpectedMetadata =
    payload.version === 1 &&
    payload.algorithm === 'AES-GCM' &&
    payload.kdf === 'PBKDF2-SHA-256' &&
    typeof payload.iterations === 'number' &&
    typeof payload.salt === 'string' &&
    typeof payload.iv === 'string' &&
    typeof payload.name === 'string' &&
    typeof payload.type === 'string' &&
    typeof payload.size === 'number' &&
    typeof payload.data === 'string';

  if (!hasExpectedMetadata) {
    throw new Error('This encrypted image file is not in a supported format.');
  }

  if (payload.iterations !== KDF_ITERATIONS) {
    throw new Error('This encrypted image uses unsupported key settings.');
  }
}

async function decryptImage(file: File, password: string) {
  let payload: unknown;

  try {
    payload = JSON.parse(await file.text());
  } catch {
    throw new Error('This is not an encrypted image file.');
  }

  assertEncryptedPayload(payload);

  const salt = base64ToBytes(payload.salt);
  const iv = base64ToBytes(payload.iv);
  const encrypted = base64ToBytes(payload.data);
  const key = await deriveKey(password, salt, ['decrypt']);
  const decrypted = await getWebCrypto().subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encrypted
  );

  if (!payload.type.startsWith('image/')) {
    throw new Error('The decrypted file is not an image.');
  }

  return {
    blob: new Blob([new Uint8Array(decrypted)], { type: payload.type }),
    filename: payload.name || 'decrypted-image',
    mimeType: payload.type,
  };
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-medium uppercase tracking-wider text-[var(--foreground)]/45">
      {children}
    </label>
  );
}

function Message({ children, tone }: { children: React.ReactNode; tone: 'error' | 'info' }) {
  return (
    <p
      className={`flex items-start gap-2 text-xs leading-5 ${
        tone === 'error'
          ? 'text-red-500 dark:text-red-400'
          : 'text-[var(--foreground)]/45'
      }`}
    >
      {tone === 'error' ? (
        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      ) : null}
      <span>{children}</span>
    </p>
  );
}

function openFileDialogOnKeyboard(
  event: React.KeyboardEvent<HTMLDivElement>,
  input: HTMLInputElement | null
) {
  if (event.key !== 'Enter' && event.key !== ' ') return;

  event.preventDefault();
  input?.click();
}

export default function ToolsPage() {
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const [encryptedFile, setEncryptedFile] = useState<File | null>(null);
  const [decryptedImage, setDecryptedImage] = useState<DecryptedImage | null>(null);
  const [encryptPassword, setEncryptPassword] = useState('');
  const [decryptPassword, setDecryptPassword] = useState('');
  const [encryptError, setEncryptError] = useState<string | null>(null);
  const [decryptError, setDecryptError] = useState<string | null>(null);
  const [encryptStatus, setEncryptStatus] = useState<string | null>(null);
  const [decryptStatus, setDecryptStatus] = useState<string | null>(null);
  const [dragTarget, setDragTarget] = useState<'encrypt' | 'decrypt' | null>(null);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const encryptedInputRef = useRef<HTMLInputElement>(null);
  const selectedImageUrlRef = useRef<string | null>(null);
  const decryptedImageUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (selectedImageUrlRef.current) URL.revokeObjectURL(selectedImageUrlRef.current);
      if (decryptedImageUrlRef.current) URL.revokeObjectURL(decryptedImageUrlRef.current);
    };
  }, []);

  const replaceSelectedImage = useCallback((file: File | null) => {
    if (selectedImageUrlRef.current) URL.revokeObjectURL(selectedImageUrlRef.current);
    selectedImageUrlRef.current = null;

    if (!file) {
      setSelectedImage(null);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    selectedImageUrlRef.current = previewUrl;
    setSelectedImage({ file, previewUrl });
  }, []);

  const replaceDecryptedImage = useCallback(
    (image: Omit<DecryptedImage, 'previewUrl'> | null) => {
      if (decryptedImageUrlRef.current) URL.revokeObjectURL(decryptedImageUrlRef.current);
      decryptedImageUrlRef.current = null;

      if (!image) {
        setDecryptedImage(null);
        return;
      }

      const previewUrl = URL.createObjectURL(image.blob);
      decryptedImageUrlRef.current = previewUrl;
      setDecryptedImage({ ...image, previewUrl });
    },
    []
  );

  const handleImageFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        setEncryptError('Choose an image file to encrypt.');
        return;
      }

      replaceSelectedImage(file);
      setEncryptError(null);
      setEncryptStatus(null);
    },
    [replaceSelectedImage]
  );

  const handleEncryptedFile = useCallback(
    (file: File) => {
      setEncryptedFile(file);
      replaceDecryptedImage(null);
      setDecryptError(null);
      setDecryptStatus(null);
    },
    [replaceDecryptedImage]
  );

  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLDivElement>) => {
      for (const item of event.clipboardData.items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();

          if (file) {
            handleImageFile(file);
            event.preventDefault();
            return;
          }
        }
      }
    },
    [handleImageFile]
  );

  const handleEncryptDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragTarget(null);

      const file = event.dataTransfer.files[0];
      if (file) handleImageFile(file);
    },
    [handleImageFile]
  );

  const handleDecryptDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragTarget(null);

      const file = event.dataTransfer.files[0];
      if (file) handleEncryptedFile(file);
    },
    [handleEncryptedFile]
  );

  const handleEncrypt = async () => {
    if (!selectedImage) {
      setEncryptError('Choose an image first.');
      return;
    }

    if (!encryptPassword) {
      setEncryptError('Enter a password for encryption.');
      return;
    }

    setIsEncrypting(true);
    setEncryptError(null);
    setEncryptStatus(null);

    try {
      const blob = await encryptImage(selectedImage.file, encryptPassword);
      const filename = `${stripExtension(selectedImage.file.name)}${ENCRYPTED_EXTENSION}`;

      downloadBlob(blob, filename);
      setEncryptStatus(`${filename} is ready.`);
    } catch (error) {
      setEncryptError(
        error instanceof Error ? error.message : 'The image could not be encrypted.'
      );
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDecrypt = async () => {
    if (!encryptedFile) {
      setDecryptError('Choose an encrypted image file first.');
      return;
    }

    if (!decryptPassword) {
      setDecryptError('Enter the password used for encryption.');
      return;
    }

    setIsDecrypting(true);
    setDecryptError(null);
    setDecryptStatus(null);
    replaceDecryptedImage(null);

    try {
      const image = await decryptImage(encryptedFile, decryptPassword);

      replaceDecryptedImage(image);
      setDecryptStatus(`${image.filename} decrypted.`);
    } catch (error) {
      setDecryptError(
        error instanceof DOMException
          ? 'Could not decrypt the image. Check the password and encrypted file.'
          : error instanceof Error
            ? error.message
            : 'The image could not be decrypted.'
      );
    } finally {
      setIsDecrypting(false);
    }
  };

  const encryptedDownloadName = selectedImage
    ? `${stripExtension(selectedImage.file.name)}${ENCRYPTED_EXTENSION}`
    : `image${ENCRYPTED_EXTENSION}`;

  return (
    <>
      <BlogNavigation />
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-base font-semibold text-[var(--foreground)]">
            Image Encryptor
          </h1>
          <p className="text-sm text-[var(--foreground)]/50">
            Password-lock an image, then restore it from the encrypted file.
          </p>
        </header>

        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <LockKeyhole className="h-4 w-4 text-[var(--foreground)]/45" />
            <h2 className="text-sm font-medium text-[var(--foreground)]">Encrypt</h2>
          </div>

          <div
            onPaste={handlePaste}
            onDragOver={(event) => {
              event.preventDefault();
              setDragTarget('encrypt');
            }}
            onDragLeave={() => setDragTarget(null)}
            onDrop={handleEncryptDrop}
            role="button"
            tabIndex={0}
            aria-label={selectedImage ? 'Choose a different image' : 'Choose an image to encrypt'}
            className={`flex min-h-64 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-5 py-6 text-center transition-colors focus:outline-none ${
              dragTarget === 'encrypt'
                ? 'border-[var(--foreground)]/40 bg-[var(--foreground)]/10'
                : 'border-[var(--foreground)]/10 bg-[var(--foreground)]/[0.02] hover:border-[var(--foreground)]/20'
            }`}
            onClick={() => imageInputRef.current?.click()}
            onKeyDown={(event) => {
              openFileDialogOnKeyboard(event, imageInputRef.current);
            }}
          >
            {selectedImage ? (
              <>
                <div className="relative w-full overflow-hidden rounded-lg border border-[var(--foreground)]/10 bg-[var(--foreground)]/5">
                  <button
                    type="button"
                    aria-label="Remove selected image"
                    onClick={(event) => {
                      event.stopPropagation();
                      replaceSelectedImage(null);
                      setEncryptStatus(null);
                    }}
                    className="absolute right-2 top-2 rounded-md bg-[var(--background)]/85 p-1 text-[var(--foreground)]/60 backdrop-blur-sm transition-colors hover:text-[var(--foreground)]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedImage.previewUrl}
                    alt=""
                    className="h-64 w-full object-contain"
                  />
                </div>
                <div className="flex w-full flex-col gap-1 text-left">
                  <p className="truncate text-sm text-[var(--foreground)]">
                    {selectedImage.file.name}
                  </p>
                  <p className="text-xs text-[var(--foreground)]/40">
                    {selectedImage.file.type || 'image'} - {formatBytes(selectedImage.file.size)}
                  </p>
                </div>
              </>
            ) : (
              <>
                <ImageIcon className="h-8 w-8 text-[var(--foreground)]/20" />
                <p className="text-sm text-[var(--foreground)]/45">
                  Paste, drop, or choose an image
                </p>
              </>
            )}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) handleImageFile(file);
                event.target.value = '';
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel>Password</FieldLabel>
            <div className="flex items-center gap-2 rounded-lg border border-[var(--foreground)]/10 bg-[var(--foreground)]/5 px-3 py-2 transition-colors focus-within:border-[var(--foreground)]/30">
              <KeyRound className="h-4 w-4 shrink-0 text-[var(--foreground)]/35" />
              <input
                type="password"
                aria-label="Encryption password"
                value={encryptPassword}
                onChange={(event) => setEncryptPassword(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/30 focus:outline-none"
                placeholder="Encryption password"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="truncate text-xs text-[var(--foreground)]/40">
              Output: {encryptedDownloadName}
            </p>
            <button
              type="button"
              onClick={handleEncrypt}
              disabled={isEncrypting || !selectedImage || !encryptPassword}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--foreground)] px-3 py-2 text-sm text-[var(--background)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download className="h-3.5 w-3.5" />
              {isEncrypting ? 'Encrypting...' : 'Encrypt'}
            </button>
          </div>

          {encryptError ? <Message tone="error">{encryptError}</Message> : null}
          {encryptStatus ? <Message tone="info">{encryptStatus}</Message> : null}
        </section>

        <section className="flex flex-col gap-4 border-t border-[var(--foreground)]/10 pt-8">
          <div className="flex items-center gap-2">
            <FileKey2 className="h-4 w-4 text-[var(--foreground)]/45" />
            <h2 className="text-sm font-medium text-[var(--foreground)]">Decrypt</h2>
          </div>

          <div
            onDragOver={(event) => {
              event.preventDefault();
              setDragTarget('decrypt');
            }}
            onDragLeave={() => setDragTarget(null)}
            onDrop={handleDecryptDrop}
            role="button"
            tabIndex={0}
            aria-label={
              encryptedFile
                ? 'Choose a different encrypted image file'
                : 'Choose an encrypted image file'
            }
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-5 py-8 text-center transition-colors ${
              dragTarget === 'decrypt'
                ? 'border-[var(--foreground)]/40 bg-[var(--foreground)]/10'
                : 'border-[var(--foreground)]/10 bg-[var(--foreground)]/[0.02] hover:border-[var(--foreground)]/20'
            }`}
            onClick={() => encryptedInputRef.current?.click()}
            onKeyDown={(event) => {
              openFileDialogOnKeyboard(event, encryptedInputRef.current);
            }}
          >
            <Upload className="h-7 w-7 text-[var(--foreground)]/20" />
            {encryptedFile ? (
              <div className="flex max-w-full flex-col gap-1">
                <p className="truncate text-sm text-[var(--foreground)]">
                  {encryptedFile.name}
                </p>
                <p className="text-xs text-[var(--foreground)]/40">
                  {formatBytes(encryptedFile.size)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-[var(--foreground)]/45">
                Drop or choose a {ENCRYPTED_EXTENSION} file
              </p>
            )}
            <input
              ref={encryptedInputRef}
              type="file"
              accept={`${ENCRYPTED_EXTENSION},application/json,${ENCRYPTED_MIME_TYPE}`}
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) handleEncryptedFile(file);
                event.target.value = '';
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel>Password</FieldLabel>
            <div className="flex items-center gap-2 rounded-lg border border-[var(--foreground)]/10 bg-[var(--foreground)]/5 px-3 py-2 transition-colors focus-within:border-[var(--foreground)]/30">
              <KeyRound className="h-4 w-4 shrink-0 text-[var(--foreground)]/35" />
              <input
                type="password"
                aria-label="Decryption password"
                value={decryptPassword}
                onChange={(event) => setDecryptPassword(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/30 focus:outline-none"
                placeholder="Decryption password"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleDecrypt}
            disabled={isDecrypting || !encryptedFile || !decryptPassword}
            className="inline-flex items-center justify-center gap-1.5 self-start rounded-lg bg-[var(--foreground)] px-3 py-2 text-sm text-[var(--background)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FileKey2 className="h-3.5 w-3.5" />
            {isDecrypting ? 'Decrypting...' : 'Decrypt'}
          </button>

          {decryptError ? <Message tone="error">{decryptError}</Message> : null}
          {decryptStatus ? <Message tone="info">{decryptStatus}</Message> : null}

          {decryptedImage ? (
            <div className="flex flex-col gap-3">
              <div className="overflow-hidden rounded-lg border border-[var(--foreground)]/10 bg-[var(--foreground)]/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={decryptedImage.previewUrl}
                  alt=""
                  className="max-h-96 w-full object-contain"
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  type="text"
                  aria-label="Decrypted image filename"
                  value={decryptedImage.filename}
                  onChange={(event) => {
                    const filename = event.target.value;
                    setDecryptedImage((current) =>
                      current ? { ...current, filename } : current
                    );
                  }}
                  className="min-w-0 flex-1 rounded-lg border border-[var(--foreground)]/10 bg-[var(--foreground)]/5 px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/30 transition-colors focus:border-[var(--foreground)]/30 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => downloadBlob(decryptedImage.blob, decryptedImage.filename)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--foreground)] px-3 py-2 text-sm text-[var(--background)] transition-opacity hover:opacity-90"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </button>
              </div>
              <p className="text-xs text-[var(--foreground)]/35">
                {decryptedImage.mimeType} - {formatBytes(decryptedImage.blob.size)}
              </p>
            </div>
          ) : null}
        </section>
      </div>
    </>
  );
}
