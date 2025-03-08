import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

interface AvatarProps {
  url: string | null;
  size: number;
  onUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
    filePath: string
  ) => void;
}

export default function Avatar({ url, size, onUpload }: AvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.log("Error downloading image: ", error);
    }
  }

  interface UploadAvatarEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & EventTarget & { files: FileList };
  }

  async function uploadAvatar(event: UploadAvatarEvent): Promise<void> {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(event, filePath);
    } catch (error) {
      alert(error);
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
          <Image
            src={avatarUrl}
            alt="Avatar"
            className="rounded-full border-4 border-gray-300 shadow-md avatar image"
            width={size}
            height={size}
          />
        ) : (
          <div
            className="rounded-full border-4 border-gray-300 shadow-md bg-gray-200 avatar no-image"
            style={{ height: size, width: size }}
          />
        )}
      </div>

      {/* Dropdown for "Edit Profile Pic ADD FORM HERE?" */}
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
