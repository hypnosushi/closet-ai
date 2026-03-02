import { Card } from "./ui/card";
import type { ClothingItem } from "../types";

export default function ItemCard(item: ClothingItem) {
  return (
    <a key={item.id} href={"/items/" + item.id}>
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
    </a>
  );
}
