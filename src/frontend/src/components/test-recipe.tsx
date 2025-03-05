import React, { useState } from "react";
import Image from "next/image";
import { likeRecipe, unlikeRecipe } from "@/app/api";

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

  const handleLikeClick = () => {
    setLiked((prevLiked) => !prevLiked);
    if (!liked) {
      likeRecipe(userId, id);
    } else {
      unlikeRecipe(userId, id);
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
        <p className="font-bold text-red-500">{allergensList?.join(", ")}</p>
        <p className="text-black text-sm">{cookingInstructions}</p>
      </div>
      <button
        className={`btn ${liked ? "btn-error" : "bg-transparent"} w-10`}
        onClick={handleLikeClick}
      >
        Like
      </button>
    </div>
  );
};

export default Box;
