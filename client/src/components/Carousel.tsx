import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { ClothingItem } from "../types";

const carouselLabels = ["Recently Added", "Favorites", "Summer Picks"];

export default function CarouselSection() {
  const carousels = [
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
  ];
  const [carouselData, setCarouselData] = useState<ClothingItem[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const intervals = carousels.map((carouselRef) =>
      setInterval(() => {
        if (carouselRef.current) {
          const nextButton = carouselRef.current.querySelector(
            "[data-carousel-next]",
          ) as HTMLElement | null;
          nextButton?.click();
        }
      }, 3000),
    );
    const getWardrobeItems = async () => {
      try {
        const response = await fetch("http://localhost:8000/wardrobe");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        const recentItems = result.slice(0, 8);
        const favoriteItems = result.slice(0, 8); // replace with actual favorites logic later
        const summerItems = result.slice(0, 8); // replace with actual filter logic later

        setCarouselData([recentItems, favoriteItems, summerItems]);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };
    getWardrobeItems();
    return () => intervals.forEach((i) => clearInterval(i));
  }, []);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-full text-stone-400 text-sm">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-full text-stone-400 text-sm">
        Something went wrong: {error}
      </div>
    );

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] px-4 py-8 gap-6 w-full max-w-lg">
      <div>
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-1 font-medium">
          Your closet
        </p>
        <h2 className="text-3xl font-semibold text-stone-800">At a glance.</h2>
      </div>

      {carousels.map((carouselRef, carouselIndex) => (
        <div key={carouselIndex}>
          <p className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-2">
            {carouselLabels[carouselIndex]}
          </p>
          <Carousel ref={carouselRef} className="w-full px-6">
            <CarouselContent className="-ml-2">
              {carouselData[carouselIndex].map((item, index) => (
                <CarouselItem key={item.id ?? index} className="pl-3 basis-1/3">
                  <Card className="border border-stone-200 shadow-none hover:border-stone-400 hover:shadow-sm transition-all duration-200 rounded-2xl overflow-hidden py-0 gap-0">
                    <CardContent
                      className="p-0 bg-stone-50"
                      style={{ aspectRatio: "1 / 1" }}
                    >
                      {item.img ? (
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-sm font-medium text-stone-300">
                            {index + 1}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-white border-stone-200 hover:bg-stone-100 hover:border-stone-300 text-stone-600 -left-5 shadow-sm" />
            <CarouselNext className="bg-white border-stone-200 hover:bg-stone-100 hover:border-stone-300 text-stone-600 -right-5 shadow-sm" />
          </Carousel>
        </div>
      ))}
    </div>
  );
}
