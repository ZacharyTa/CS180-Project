import { Heart } from "lucide-react";
import Image from "next/image";
import React from "react";

interface RecipeComponentProps {
  recipe_id: number;
  recipe_name: string;
  recipe_description: string;
  recipe_image: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
}
export default function RecipeComponent({
  recipe_id,
  recipe_name,
  recipe_description,
  recipe_image,
}: RecipeComponentProps) {
  const dummy_url =
    "https://www.simplyrecipes.com/thmb/Boo37yZBqeSpmELBIP_BBX_yVlU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Spaghetti-And-Meatballs-LEAD-3-40bdae68ea144751a8e0a4b0f972af2d.jpg";
  return (
    <div className="relative h-full w-full">
      <Image
        src={dummy_url}
        alt={"recipe_name"}
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
