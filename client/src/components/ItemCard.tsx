import { Card } from "./ui/card";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import type { ClothingItem } from "../types";

export default function ItemCard() {
  const [data, setData] = useState<ClothingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("api_placeholder");
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
    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ul>
      {data &&
        data.map((item) => (
          <NavLink key={item.id} to={"/items/" + item.id}>
            <Card
              className="
                    w-80 
                    aspect-square 
                    flex 
                    items-center 
                    justify-center 
                    bg-white 
                    shadow-sm 
                    hover:shadow-md 
                    transition
                    "
            >
              <img src={item.img} alt={item.name} />
            </Card>
          </NavLink>
        ))}
    </ul>
  );
}
