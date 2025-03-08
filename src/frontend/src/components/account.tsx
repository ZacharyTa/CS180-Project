import { useState, useEffect, ChangeEvent } from "react";
import { supabase } from "@/lib/supabase";
import Avatar from "@/components/avatar";
import type { User, Session } from "@supabase/supabase-js";

export default function Account({
  user,
  session,
}: {
  user: User | null;
  session: Session | null;
}) {
  const [loading, setLoading] = useState(true);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function getProfile() {
      setLoading(true);

      if (!user) {
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select(`avatar_url`)
        .eq("id", user.id)
        .single();

      if (!ignore) {
        if (error) {
          console.warn(error);
        } else if (data) {
          setAvatarUrl(data.avatar_url);
        }
      }

      setLoading(false);
    }

    getProfile();

    return () => {
      ignore = true;
    };
  }, [session]);

  async function updateProfile(
    event: ChangeEvent<HTMLFormElement> | ChangeEvent<HTMLInputElement>,
    avatarUrl: string | null
  ) {
    event.preventDefault();

    setLoading(true);

    if (!user) {
      alert("User not found");
      setLoading(false);
      return;
    }

    const updates = {
      id: user.id,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    };

    const { error } = await supabase.from("profiles").upsert(updates);

    if (error) {
      alert(error.message);
    } else {
      setAvatarUrl(avatarUrl);
    }
    setLoading(false);
  }

  const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateProfile(event, avatar_url);
  };

  return (
    <form onSubmit={handleSubmit} className="form-widget">
      <Avatar
        url={avatar_url}
        size={150}
        onUpload={(event, url) => {
          updateProfile(event, url);
        }}
      />
      {loading && (
        <div className="absolute top-32 bg-white shadow-lg p-2 rounded-md">
          <p>Uploading...</p>
        </div>
      )}
    </form>
  );
}
