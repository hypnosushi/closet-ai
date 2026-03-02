import { useState, useEffect } from "react";
import type { ClothingItem } from "../types";
import ItemCard from "./ItemCard";

export default function WardrobeGrid() {
  const [data, setData] = useState<ClothingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getWardrobeItems = async () => {
      try {
        const response = await fetch("http://localhost:5173/wardrobe");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setIsLoading(false);
      }
    };
    getWardrobeItems();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ul>
      {data && data.map((item, index) => <ItemCard {...item} key={index} />)}
    </ul>
  );
}
