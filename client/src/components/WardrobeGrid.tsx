import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ClothingItem } from "../types";
import { useAuth } from "../context/AuthContext";

export default function WardrobeGrid() {
  const [data, setData] = useState<ClothingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const getWardrobeItems = async () => {
      try {
        const response = await fetch("http://localhost:8000/wardrobe", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };
    getWardrobeItems();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-stone-400 text-sm">
        Loading your closet...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-stone-400 text-sm">
        Something went wrong: {error}
      </div>
    );
  }

  return (
    <div className="px-8 py-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-stone-400 font-medium mb-1">
          Your wardrobe
        </p>
        <h1 className="text-3xl font-semibold text-stone-800">
          {data.length} items
        </h1>
      </div>
      {/* Masonry grid using CSS columns */}
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
        {data.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/items/${item.id}`)}
            className="break-inside-avoid cursor-pointer group rounded-2xl overflow-hidden border border-stone-200 hover:border-stone-400 hover:shadow-md transition-all duration-200 bg-white"
          >
            <img
              src={item.img}
              alt={item.name}
              className="w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-stone-800 truncate">
                {item.name}
              </p>
              <p className="text-xs text-stone-400">
                {item.brand} · ${item.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
