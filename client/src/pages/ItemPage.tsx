import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { useState, useEffect } from "react";
import type { ClothingItem } from "../types";

export default function ItemPage() {
  const { id } = useParams();
  const [itemInfo, setItemInfo] = useState<ClothingItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getItemInfo = async () => {
      try {
        const response = await fetch(
          `/api/items/${encodeURIComponent(id ?? "")}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: ClothingItem = await response.json();
        setItemInfo(result);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      }
    };

    if (id) {
      getItemInfo();
    }
  }, [id]);

  if (error) {
    return <div>Error...</div>;
  }

  const deleteItem = async (id: string) => {
    try {
      const response = await fetch("delete_api_placeholder", {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      navigate("/closet");
      console.log(`Successfully deleted item ${id}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-16 px-8 py-12">
      {/* Main Item Card */}
      <Card
        className="
          w-full 
          max-w-md 
          aspect-square 
          flex 
          items-center 
          justify-center 
          text-4xl 
          font-semibold 
          bg-white 
          shadow-lg"
      >
        <img src={itemInfo?.img ?? ""} alt={itemInfo?.name ?? "item"} />
      </Card>

      {/* Item Details */}
      <div className="flex-1 max-w-xl space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {itemInfo?.name ?? ""}
          </h1>
          <p className="text-sm text-muted-foreground">
            {itemInfo?.upload_date
              ? itemInfo.upload_date instanceof Date
                ? itemInfo.upload_date.toLocaleDateString()
                : new Date(itemInfo.upload_date).toLocaleDateString()
              : ""}
          </p>
        </div>

        {/* Attributes */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <p>
            <span className="font-medium">
              Category: {itemInfo?.category ?? ""}
            </span>{" "}
            —
          </p>
          <p>
            <span className="font-medium">Color: {itemInfo?.color ?? ""}</span>{" "}
            —
          </p>
          <p>
            <span className="font-medium">
              Material: {itemInfo?.material ?? ""}
            </span>{" "}
            —
          </p>
          <p>
            <span className="font-medium">Brand: {itemInfo?.brand ?? ""}</span>{" "}
            —
          </p>
          <p>
            <span className="font-medium">Price: ${itemInfo?.price ?? ""}</span>{" "}
            —
          </p>
          <button
            onClick={() => {
              if (id) deleteItem(id);
            }}
          >
            Delete
          </button>
        </div>

        {/* Similar Items
        <div className="pt-6">
          <h2 className="text-lg font-semibold mb-4">Similar items</h2>
          <div className="flex flex-row gap-6 flex-wrap">
            {similarItemsElements}
          </div>
        </div> */}
      </div>
    </div>
  );
}
