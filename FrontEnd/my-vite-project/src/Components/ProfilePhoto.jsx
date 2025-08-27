import React from "react";

export const uploadProfilePhoto = async (file, token) => {
  if (!file) return null;

  // Convert File -> data URL and strip prefix to raw Base64
  const toBase64 = (f) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });

  const dataUrl = await toBase64(file);          // "data:image/png;base64,XXXX"
  const base64 = dataUrl.split(',')[1];          // keep only "XXXX" (raw Base64)

  const res = await fetch('http://localhost:3000/api/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ file: base64, fileName: file.name || 'avatar.jpg' }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(`Upload failed (${res.status}): ${err || 'Bad Request'}`);
  }
  const data = await res.json();

  // Normalize fields from backend/storage
  const photoUrl = data.url || data.photoUrl || null;
  const thumbnailUrl = data.thumbnailUrl || data.thumbnail || null;
  const filePath = data.filePath || null;

  return { photoUrl, thumbnailUrl, filePath };
};
