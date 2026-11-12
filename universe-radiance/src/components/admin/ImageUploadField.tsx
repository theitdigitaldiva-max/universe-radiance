"use client";

import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ImageUploadField({
  label,
  value,
  folder,
  onChange,
}: {
  label: string;
  value: string;
  folder: string;
  onChange: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    const supabase = createClient();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${folder}/${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(path, file, { upsert: false });
    if (uploadError) {
      setError("Upload failed. Make sure the storage bucket “images” exists.");
      setBusy(false);
      e.target.value = "";
      return;
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(path);
    onChange(publicUrl);
    setBusy(false);
  };

  return (
    <div>
      <span className="label-field">{label}</span>
      {value ? (
        <div className="relative mt-1 h-36 w-full overflow-hidden rounded-xl border border-lavender bg-lavender/10">
          <Image src={value} alt={label} fill unoptimized className="object-cover" />
        </div>
      ) : (
        <div className="mt-1 flex h-20 w-full items-center justify-center rounded-xl border border-dashed border-lavender text-xs text-charcoal/40">
          No image set
        </div>
      )}
      <div className="mt-2 flex items-center gap-3">
        <label className={`btn-outline !py-1.5 text-xs ${busy ? "pointer-events-none opacity-50" : "cursor-pointer"}`}>
          {busy ? "Uploading..." : value ? "Replace Photo" : "Upload Photo"}
          <input type="file" accept="image/*" onChange={upload} disabled={busy} className="hidden" />
        </label>
        {value && (
          <button type="button" onClick={() => onChange("")} className="text-xs uppercase tracking-wider text-red-500 hover:underline">
            Remove
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
