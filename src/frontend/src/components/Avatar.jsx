import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Avatar({ url, size, onUpload }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (url) fetchAvatar(url);
  }, [url]);

  async function fetchAvatar(userId) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setAvatarUrl(data?.avatar_url || null);
    } catch (error) {
      console.error("Error fetching avatar:", error.message);
    }
  }

  async function uploadAvatar(event) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(event, filePath);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* Profile Picture with Clickable Frame */}
      <div
        className="rounded-full border-4 border-gray-300 shadow-md cursor-pointer hover:opacity-90 transition"
        style={{ height: size, width: size }}
        onClick={() => setShowDropdown(!showDropdown)} // Toggle dropdown
      >
        {avatarUrl ? (
  <img
    src={avatarUrl}
    alt="Avatar"
    className="rounded-full border-4 border-gray-300 shadow-md"
    style={{ height: size, width: size }}
  />
) : (
  <div
    className="rounded-full border-4 border-gray-300 shadow-md bg-gray-200"
    style={{ height: size, width: size }}
  />
)}
      </div>

      {/* Dropdown for "Edit Profile Pic" */}
      {showDropdown && (
        <div className="absolute top-32 bg-white shadow-lg p-2 rounded-md">
          <label className="cursor-pointer text-sm font-semibold text-[#001F3F] ">
            {uploading ? "Uploading ..." : "Edit Profile Pic"}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={uploadAvatar}
              disabled={uploading}
            />
          </label>
        </div>
      )}
    </div>
  );
}
