import React, { useState } from "react";
import Image from "next/image";
import { likeRecipe, unlikeRecipe } from "@/app/api";
// import {Mynerve} from "next/font/google"

// const mynerve = Mynerve({
//     weight: '400',
//     subsets:['latin']});

interface BoxProps {
  id: number;
  title: string;
  imgUrl: string;
  cookingInstructions: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  userId: string;
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
  userId,
}: BoxProps) => {
  const [liked, setLiked] = useState(false);

  const handleLikeClick = () => {
    setLiked((prevLiked) => !prevLiked);
    if (!liked) {
      likeRecipe(userId, id);
    } else {
      unlikeRecipe(userId, id);
    }
  };

  return (
    <div className="card p-4 bg-yellow-200 shadow-xl float-left w-full h-full">
      <div>
        {/* <p className=" text-center mb-4 text-blue-800">Title is: {title}</p> */}
        <Image src={imgUrl} width={500} height={500} alt={title} />
        <h1 className="text-xl text-center text-black font-bold"> {title}</h1>
        <h2 className="text-s text-center text-black">
          Calories: {calories} | Protein: {protein} | Carbs: {carbs} | Fats:{" "}
          {fats}
        </h2>
        <p className="text-black">{cookingInstructions}</p>
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
