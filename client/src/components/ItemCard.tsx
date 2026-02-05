import { Card } from "./ui/card";
import { NavLink } from "react-router-dom";
import type { ClothingItem } from "../types";

export default function ItemCard(item: ClothingItem) {
  return (
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
  );
}
