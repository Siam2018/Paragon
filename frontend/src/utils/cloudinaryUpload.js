// Cloudinary upload utility for React (client-side)
// Usage: import { uploadToCloudinary } from "../utils/cloudinaryUpload";

export async function uploadToCloudinary(file, folder = "paragon") {
  const cloudName = "du9qmvo1g"; // Your Cloudinary cloud name
  const uploadPreset = "Paragon"; // Your unsigned upload preset name

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Cloudinary upload failed");
  const data = await res.json();
  return data.secure_url; // This is the image/file URL to save in your backend
}
