import React, { useState } from "react";
import {
  likeRecipe,
  unlikeRecipe,
  dislikeRecipe,
  undislikeRecipe,
} from "@/app/api";
import { Recipe } from "@/lib/types/recipe";

interface BoxProps {
  userId: string;
  recipe: Recipe;
  isProfile: boolean;
}

const Box = ({ userId, recipe, isProfile }: BoxProps) => {
  const [liked, setLiked] = useState(isProfile);
  const [disliked, setDisliked] = useState(false); // ZACH change this

  const handleLikeClick = () => {
    setLiked((prevLiked) => !prevLiked);
    if (!liked) {
      likeRecipe(userId, recipe.id);
    } else {
      unlikeRecipe(userId, recipe.id);
    }
  };

  const handleDislikeClick = () => {
    setDisliked((prevDisliked) => !prevDisliked);
    if (!disliked) {
      dislikeRecipe(userId, recipe.id);
    } else {
      undislikeRecipe(userId, recipe.id);
    }
  };

  return (
    <div
      className={`card p-4 bg-yellow-200 shadow-xl w-full ${
        isProfile ? "h-auto" : "h-full"
      }`}
    >
      <div>
        {recipe.imageURL && (
          <img
            src={recipe.imageURL}
            width={500}
            height={500}
            alt={recipe.recipeName}
          />
        )}
        <h1 className="text-xl text-center text-black font-bold">
          {recipe.recipeName}
        </h1>
        <h2 className="text-s text-center text-black">
          Calories: {recipe.calories} | Protein: {recipe.protein} | Carbs:{" "}
          {recipe.carbs} | Fats: {recipe.fats}
        </h2>
        <h3 className="text-lg text-center text-black font-bold">Allergens:</h3>
        <p className="font-bold text-red-500 text-center">
          {recipe.allergensList?.join(", ") || "None"}
        </p>
        <div className="flex flex-row items-center justify-between">
          <button
            role="like"
            aria-label="like"
            className={`btn ${liked ? "btn-error" : "bg-transparent"} w-12`}
            onClick={handleLikeClick}
            disabled={disliked}
          >
            Like
          </button>
          <button
            role="dislike"
            aria-label="dislike"
            className={`btn ${
              disliked ? "btn-secondary" : "bg-transparent"
            } w-12`}
            onClick={handleDislikeClick}
            disabled={liked}
          >
            Dislike
          </button>
        </div>
        <h2 className="text-s text-start text-black">
          Instructions:
          <p className=" text-xs text-justified">
            {recipe.cookingInstructions}
          </p>
        </h2>
      </div>
    </div>
  );
};

export default Box;
