import { Heart } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Recipe } from "@/lib/types/recipe";

interface RecipeComponentProps {
  recipe: Recipe;
}

export default function RecipeComponent({ recipe }: RecipeComponentProps) {
  return (
    <div className="relative h-full w-full">
      <Image
        src={recipe.imageURL}
        alt={recipe.recipeName}
        layout="fill"
        objectFit="cover"
      />
      <div className="absolute bottom-4 right-4 flex flex-col items-center space-y-4">
        <button className="rounded-full bg-gray-800 p-2 text-red-300">
          <Heart size={24} />
        </button>
      </div>
    </div>
  );
}
