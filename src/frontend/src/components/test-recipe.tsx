import React, { useState } from "react";
import Image from "next/image";
import {
  likeRecipe,
  unlikeRecipe,
  dislikeRecipe,
  undislikeRecipe,
} from "@/app/api";

interface BoxProps {
  id: number;
  title: string;
  imgUrl: string;
  cookingInstructions: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  allergensList: string[];
  userId: string;
  isProfile: boolean;
}

const Box = ({
  id,
  title,
  imgUrl,
  cookingInstructions,
  calories,
  protein,
  carbs,
  fats,
  allergensList,
  userId,
  isProfile,
}: BoxProps) => {
  const [liked, setLiked] = useState(isProfile);
  const [disliked, setDisliked] = useState(false); // ZACH change this

  const handleLikeClick = () => {
    setLiked((prevLiked) => !prevLiked);
    if (!liked) {
      likeRecipe(userId, id);
    } else {
      unlikeRecipe(userId, id);
    }
  };

  const handleDislikeClick = () => {
    setDisliked((prevDisliked) => !prevDisliked);
    if (!disliked) {
      dislikeRecipe(userId, id);
    } else {
      undislikeRecipe(userId, id);
    }
  };

  return (
    <div
      className={`card p-4 bg-yellow-200 shadow-xl w-full ${
        isProfile ? "h-auto" : "h-full"
      }`}
    >
      <div>
        <Image src={imgUrl} width={500} height={500} alt={title} />
        <h1 className="text-xl text-center text-black font-bold"> {title}</h1>
        <h2 className="text-s text-center text-black">
          Calories: {calories} | Protein: {protein} | Carbs: {carbs} | Fats:
          {fats}
        </h2>
        <h3 className="text-lg text-center text-black font-bold">Allergens:</h3>
        <p className="font-bold text-red-500 text-center">
          {allergensList?.join(", ")}
        </p>
        <p className="text-black text-sm">{cookingInstructions}</p>
      </div>
      <div className="flex flex-row items-center justify-between">
        <button
          className={`btn ${liked ? "btn-error" : "bg-transparent"} w-12`}
          onClick={handleLikeClick}
          disabled={disliked}
        >
          Like
        </button>
        <button
          className={`btn ${
            disliked ? "btn-secondary" : "bg-transparent"
          } w-12`}
          onClick={handleDislikeClick}
          disabled={liked}
        >
          Dislike
        </button>
      </div>
    </div>
  );
};

export default Box;
