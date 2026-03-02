import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ClothingItem } from "../types";

const DUMMY_DATA: ClothingItem[] = [
  {
    id: 1,
    name: "White Linen Shirt",
    img: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400",
    upload_date: new Date(),
    category: "Shirt",
    color: "White",
    material: "Linen",
    brand: "Uniqlo",
    price: 39,
  },
  {
    id: 2,
    name: "Navy Wool Coat",
    img: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400",
    upload_date: new Date(),
    category: "Coat",
    color: "Navy",
    material: "Wool",
    brand: "COS",
    price: 220,
  },
  {
    id: 3,
    name: "Cream Cashmere Sweater",
    img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400",
    upload_date: new Date(),
    category: "Sweater",
    color: "Cream",
    material: "Cashmere",
    brand: "Everlane",
    price: 130,
  },
  {
    id: 4,
    name: "Straight Leg Jeans",
    img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400",
    upload_date: new Date(),
    category: "Jeans",
    color: "Indigo",
    material: "Denim",
    brand: "Levi's",
    price: 89,
  },
  {
    id: 5,
    name: "Silk Slip Dress",
    img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
    upload_date: new Date(),
    category: "Dress",
    color: "Champagne",
    material: "Silk",
    brand: "Reformation",
    price: 180,
  },
  {
    id: 6,
    name: "Black Leather Jacket",
    img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
    upload_date: new Date(),
    category: "Jacket",
    color: "Black",
    material: "Leather",
    brand: "AllSaints",
    price: 350,
  },
  {
    id: 7,
    name: "Striped Cotton Tee",
    img: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400",
    upload_date: new Date(),
    category: "T-Shirt",
    color: "Blue/White",
    material: "Cotton",
    brand: "J.Crew",
    price: 45,
  },
  {
    id: 8,
    name: "Tailored Trousers",
    img: "https://images.unsplash.com/photo-1594938298603-c8148c4b4063?w=400",
    upload_date: new Date(),
    category: "Pants",
    color: "Camel",
    material: "Wool",
    brand: "Zara",
    price: 69,
  },
];

export default function WardrobeGrid() {
  const [data, setData] = useState<ClothingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getWardrobeItems = async () => {
      try {
        await new Promise((res) => setTimeout(res, 500));
        setData(DUMMY_DATA);
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
