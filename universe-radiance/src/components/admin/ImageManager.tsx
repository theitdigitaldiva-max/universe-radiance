"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ProductImage } from "@/lib/types";

export function ImageManager({
  productId,
  images,
}: {
  productId: string;
  images: ProductImage[];
}) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const refresh = () => {
    setUrl("");
    setBusy(false);
    router.refresh();
  };

  const addByUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setBusy(true);
    setError("");
    const supabase = createClient();
    const maxOrder = images.reduce((m, i) => Math.max(m, i.sort_order), 0);
    const { error: insertError } = await supabase.from("product_images").insert({
      product_id: productId,
      url: url.trim(),
      sort_order: maxOrder + 1,
    });
    if (insertError) setError("Could not add image.");
    refresh();
  };

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    const supabase = createClient();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `products/${productId}/${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(path, file, { upsert: false });
    if (uploadError) {
      setError("Upload failed. Make sure the storage bucket “images” exists.");
      setBusy(false);
      return;
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(path);
    const maxOrder = images.reduce((m, i) => Math.max(m, i.sort_order), 0);
    await supabase.from("product_images").insert({
      product_id: productId,
      url: publicUrl,
      sort_order: maxOrder + 1,
    });
    e.target.value = "";
    refresh();
  };

  const removeImage = async (id: string) => {
    setBusy(true);
    const supabase = createClient();
    await supabase.from("product_images").delete().eq("id", id);
    refresh();
  };

  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="card p-6">
      <h2 className="font-serif text-xl text-charcoal">Product Images</h2>

      {sorted.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {sorted.map((image) => (
            <div key={image.id} className="group relative aspect-square overflow-hidden rounded-xl bg-lavender/20">
              <Image src={image.url} alt={image.alt ?? "Product image"} fill sizes="150px" className="object-cover" />
              <button
                onClick={() => removeImage(image.id)}
                disabled={busy}
                className="absolute inset-x-0 bottom-0 bg-charcoal/70 py-1 text-xs text-ivory opacity-0 transition group-hover:opacity-100"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={addByUrl} className="mt-4 flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Or paste an image URL..."
          className="input-field flex-1"
        />
        <button type="submit" disabled={busy || !url.trim()} className="btn-outline !px-4 text-xs">
          Add URL
        </button>
      </form>

      <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-lavender py-5 text-sm text-plum transition hover:border-plum">
        <span>{busy ? "Working..." : "Upload image from your device"}</span>
        <input type="file" accept="image/*" onChange={uploadFile} disabled={busy} className="hidden" />
      </label>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
