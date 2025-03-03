"use client";

import React, { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

interface RecipeCarouselProps {
  children: React.ReactNode;
  onLastSlide: () => void;
}

export default function RecipeCarousel({
  children,
  onLastSlide,
}: RecipeCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: "y",
    loop: false,
    dragFree: false,
    containScroll: "trimSnaps", // Makes sure it aligns items properly
  });
  const [isLastSlide, setIsLastSlide] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const lastIndex = emblaApi.scrollSnapList().length - 1;
    const currentIndex = emblaApi.selectedScrollSnap();
    setIsLastSlide(currentIndex === lastIndex);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (isLastSlide) {
      console.log("Last slide reached");
      onLastSlide();
    }
  }, [isLastSlide, onLastSlide]);

  return (
    <div className="embla h-full w-full" ref={emblaRef}>
      <div className="embla__container h-full">
        {React.Children.map(children, (child) => (
          <div className="embla__slide h-full w-full flex-shrink-0">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
