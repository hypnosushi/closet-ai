import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { ClothingItem } from "../types";

export default function ItemPage() {
  const { id } = useParams();
  const [itemInfo, setItemInfo] = useState<ClothingItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<ClothingItem>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getWardrobeItems = async () => {
      try {
        const response = await fetch(`http://localhost:8000/wardrobe/${id}`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        setItemInfo(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };
    getWardrobeItems();
  }, [id]);

  const deleteItem = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/wardrobe/${id}`, {
        method: "DELETE",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      navigate("/closet");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-stone-400 text-sm">
        Something went wrong: {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-stone-400 text-sm">
        Loading your closet...
      </div>
    );
  }

  const fields = [
    { label: "Category", value: itemInfo?.category },
    { label: "Color", value: itemInfo?.color },
    { label: "Material", value: itemInfo?.material },
    { label: "Brand", value: itemInfo?.brand },
    {
      label: "Price",
      value: itemInfo?.price ? `$${itemInfo.price}` : undefined,
    },
  ];

  const handleEditOpen = () => {
    setEditData({
      name: itemInfo?.name,
      brand: itemInfo?.brand,
      color: itemInfo?.color,
      category: itemInfo?.category,
      material: itemInfo?.material,
      price: itemInfo?.price,
    });
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/wardrobe/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Item updates:", data);
    } catch (err) {
      console.error("Failed to update item:", err);
    } finally {
      setIsLoading(false);
    }
    setItemInfo((prev) => (prev ? { ...prev, ...editData } : prev));
    setIsEditing(false);
  };

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

  const inputClass =
    "w-full bg-stone-50 border border-stone-200 focus:border-stone-400 focus:ring-2 focus:ring-stone-100 rounded-xl py-2.5 px-4 text-sm text-stone-800 outline-none transition-all duration-200 placeholder:text-stone-300";
  const labelClass =
    "text-xs uppercase tracking-widest text-stone-400 font-medium block mb-1.5";

  return (
    <div className="flex flex-col lg:flex-row gap-12 px-8 py-12 max-w-5xl mx-auto">
      {/* Image */}
      <div className="w-full max-w-sm rounded-3xl overflow-hidden border border-stone-200 shadow-sm bg-white flex-shrink-0">
        <img
          src={itemInfo?.img ?? ""}
          alt={itemInfo?.name ?? "item"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between py-2">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <p className="text-xs uppercase tracking-widest text-stone-400 font-medium mb-1">
              Item details
            </p>
            <h1 className="text-3xl font-semibold text-stone-800">
              {itemInfo?.name ?? ""}
            </h1>
            <p className="text-sm text-stone-400 mt-1">
              {itemInfo?.upload_date
                ? new Date(itemInfo.upload_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""}
            </p>
          </div>

          {/* Attributes */}
          <div className="grid grid-cols-2 gap-3">
            {fields.map(({ label, value }) => (
              <div
                key={label}
                className="bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3"
              >
                <p className="text-xs uppercase tracking-widest text-stone-400 font-medium mb-0.5">
                  {label}
                </p>
                <p className="text-sm font-medium text-stone-800">
                  {value ?? "—"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {/* Edit form */}
          {isEditing && (
            <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50 space-y-3">
              <p className="text-xs uppercase tracking-widest text-stone-400 font-medium">
                Edit item
              </p>

              <div>
                <label className={labelClass}>Name</label>
                <input
                  type="text"
                  value={editData.name ?? ""}
                  onChange={(e) =>
                    setEditData((p) => ({ ...p, name: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Brand</label>
                <input
                  type="text"
                  value={editData.brand ?? ""}
                  onChange={(e) =>
                    setEditData((p) => ({ ...p, brand: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Color</label>
                <input
                  type="text"
                  value={editData.color ?? ""}
                  onChange={(e) =>
                    setEditData((p) => ({ ...p, color: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className={labelClass}>Category</label>
                  <select
                    value={editData.category ?? ""}
                    onChange={(e) =>
                      setEditData((p) => ({ ...p, category: e.target.value }))
                    }
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
                    value={editData.material ?? ""}
                    onChange={(e) =>
                      setEditData((p) => ({ ...p, material: e.target.value }))
                    }
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

              <div>
                <label className={labelClass}>Price</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center text-sm text-stone-400">
                    $
                  </span>
                  <input
                    type="number"
                    value={editData.price ?? ""}
                    onChange={(e) =>
                      setEditData((p) => ({
                        ...p,
                        price: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-stone-900 hover:bg-stone-700 text-white text-sm font-medium py-2.5 rounded-xl transition-all duration-200"
                >
                  Save changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 border border-stone-200 hover:bg-stone-100 text-stone-500 text-sm font-medium py-2.5 rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleEditOpen}
              className="flex-1 bg-stone-900 hover:bg-stone-700 text-white text-sm font-medium py-3 rounded-2xl transition-all duration-200"
            >
              Update item
            </button>
            <button
              onClick={() => {
                if (id) deleteItem(id);
              }}
              className="flex-1 border border-stone-200 hover:border-red-200 hover:bg-red-50 hover:text-red-500 text-stone-400 text-sm font-medium py-3 rounded-2xl transition-all duration-200"
            >
              Remove from closet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
