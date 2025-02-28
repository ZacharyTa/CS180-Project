import React, { useState } from "react";
import Image from "next/image";
import { likeRecipe, unlikeRecipe } from "@/app/api";
import { Recipe } from "@/lib/types/recipe";

interface BoxProps {
  userId: string;
  recipe: Recipe;
}

const Box = ({ userId, recipe }: BoxProps) => {
  const [liked, setLiked] = useState(false);

  const handleLikeClick = () => {
    setLiked((prevLiked) => !prevLiked);
    if (!liked) {
      likeRecipe(userId, recipe.id);
    } else {
      unlikeRecipe(userId, recipe.id);
    }
  };

  return (
    <div className="card w-full p-4 bg-yellow-200 shadow-xl h-full">
      <div>
        {/* <p className=" text-center mb-4 text-blue-800">Title is: {title}</p> */}
        <Image
          src={recipe.imageURL}
          width={500}
          height={500}
          alt={recipe.recipeName}
        />
        <h1 className="text-xl text-center text-black font-bold">
          {recipe.recipeName}
        </h1>
        <h2 className="text-s text-center text-black">
          Calories: {recipe.calories} | Protein: {recipe.protein} | Carbs:{" "}
          {recipe.carbs} | Fats: {recipe.fats}
        </h2>
        <h2 className="text-s text-center text-black">
          Allergens: {recipe.allergensList.join(", ")}
        </h2>
        <h2 className="text-s text-center text-black">
          Intructions:
          <p className=" text-xs text-justified">
            {recipe.cookingInstructions}
          </p>
        </h2>
        <h3 className="text-xs text-right text-black">ID: {recipe.id}</h3>
      </div>
      <div className="flex justify-around space-x-1">
        <button className="btn btn-success w-40" onClick={handleLikeClick}>
          Like
        </button>
      </div>
    </div>
  );
};

export default Box;
