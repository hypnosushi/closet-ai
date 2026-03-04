import { useState, useRef } from "react";
import type { ClothingItem } from "../types";

interface ItemFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (item: Omit<ClothingItem, "id" | "upload_date">) => void;
}

export default function ItemForm({ open, onClose, onSubmit }: ItemFormProps) {
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [category, setCategory] = useState("");
  const [material, setMaterial] = useState("");
  const [price, setPrice] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clothingTypes = [
    "T-Shirt",
    "Shirt",
    "Blouse",
    "Sweater",
    "Hoodie",
    "Jacket",
    "Coat",
    "Dress",
    "Skirt",
    "Pants",
    "Jeans",
    "Shorts",
    "Shoes",
    "Bag",
    "Accessory",
    "Other",
  ];
  const materials = [
    "Cotton",
    "Linen",
    "Wool",
    "Cashmere",
    "Silk",
    "Polyester",
    "Nylon",
    "Denim",
    "Leather",
    "Suede",
    "Velvet",
    "Other",
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!name || !category) return;
    onSubmit?.({
      name,
      brand,
      color,
      category,
      material,
      price: parseFloat(price) || 0,
      img: image ?? "",
    });
    // Reset
    setImage(null);
    setName("");
    setBrand("");
    setColor("");
    setCategory("");
    setMaterial("");
    setPrice("");
    onClose();
  };

  if (!open) return null;

  const inputClass =
    "w-full bg-stone-50 border border-stone-200 focus:border-stone-400 focus:ring-2 focus:ring-stone-100 rounded-xl py-2.5 px-4 text-sm text-stone-800 outline-none transition-all duration-200 placeholder:text-stone-300";
  const labelClass =
    "text-xs uppercase tracking-widest text-stone-400 font-medium block mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-[#FAF7F2] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-stone-400 font-medium">
              New item
            </p>
            <h2 className="text-xl font-semibold text-stone-800">
              Add to closet
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition-all duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Image upload */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-40 border-2 border-dashed border-stone-200 hover:border-stone-400 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 overflow-hidden bg-stone-50"
          >
            {image ? (
              <img
                src={image}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <svg
                  className="w-6 h-6 text-stone-300 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <p className="text-sm text-stone-400">Upload photo</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* Name */}
          <div>
            <label className={labelClass}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. White Linen Shirt"
              className={inputClass}
            />
          </div>

          {/* Brand */}
          <div>
            <label className={labelClass}>Brand</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Zara, Levi's, Uniqlo"
              className={inputClass}
            />
          </div>

          {/* Color */}
          <div>
            <label className={labelClass}>Color</label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="e.g. Navy, Cream, Forest Green"
              className={inputClass}
            />
          </div>

          {/* Category + Material */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className={labelClass}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass}
              >
                <option value="" disabled>
                  Select
                </option>
                {clothingTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className={labelClass}>Material</label>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className={inputClass}
              >
                <option value="" disabled>
                  Select
                </option>
                {materials.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className={labelClass}>Price</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-sm text-stone-400">
                $
              </span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className={`${inputClass} pl-8`}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!name || !category}
          className="w-full mt-6 bg-stone-900 hover:bg-stone-700 disabled:bg-stone-200 disabled:cursor-not-allowed text-white text-sm font-medium py-3 rounded-2xl transition-all duration-200"
        >
          Add to closet
        </button>
      </div>
    </div>
  );
}
