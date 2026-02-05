import { Button } from "../components/ui/button";
import WardrobeGrid from "../components/WardrobeGrid";

export default function ClosetPage() {
  const filters = ["Category", "Color", "Material"];

  const filterElements = filters.map((filter) => {
    return (
      <Button key={filter} className="mx-4 mb-16 mt-8">
        {filter}
      </Button>
    );
  });

  return (
    <div className="mx-8">
      <div className="flex flex-row">{filterElements}</div>
      <div className="flex flex-row justify-around flex-wrap gap-6 px-4">
        <WardrobeGrid />
      </div>
    </div>
  );
}
