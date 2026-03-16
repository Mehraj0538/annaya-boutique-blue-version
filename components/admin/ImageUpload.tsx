"use client";

import { useState } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  userToken: string;
}

export function ImageUpload({ images, onChange, userToken }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    const newUrls: string[] = [];
    try {
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const formData = new FormData();
        formData.append("image", file);
        const res = await api.post("/api/upload", formData, {
          headers: { "x-auth0-id": userToken },
        });
        newUrls.push(res.data.url);
      }
      onChange([...images, ...newUrls]);
      toast.success(`${newUrls.length} image(s) uploaded successfully`);
    } catch {
      toast.error("Failed to upload image(s)");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (idx: number) => onChange(images.filter((_, i) => i !== idx));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 mb-4">
        {images.map((url, idx) => (
          <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden group border border-slate-200">
            <img src={url} alt="upload" className="w-full h-full object-cover" />
            <button type="button" onClick={() => removeImage(idx)}
              className="absolute top-2 right-2 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-rose-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <label className="border-2 border-dashed border-slate-300 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors w-full group bg-white">
        <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" disabled={isUploading} />
        {isUploading ? (
          <Loader2 className="w-8 h-8 text-royal animate-spin mb-3" />
        ) : (
          <div className="w-14 h-14 bg-royal/5 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-royal/10 transition-colors">
            <UploadCloud className="w-6 h-6 text-royal" />
          </div>
        )}
        <span className="text-sm font-bold text-slate-700">{isUploading ? "Processing visual assets..." : "Click or drag to attach visuals"}</span>
        <span className="text-xs text-slate-400 mt-1 font-medium">Supports high-res PNG, JPG, WEBP</span>
      </label>
    </div>
  );
}
