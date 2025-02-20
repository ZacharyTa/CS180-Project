import React from "react";
import Image from "next/image";
// import {Mynerve} from "next/font/google"

// const mynerve = Mynerve({
//     weight: '400',
//     subsets:['latin']});

interface BoxProps {
  title: string;
  imgUrl: string;
  cookingInstructions: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

const Box = ({
  title,
  imgUrl,
  cookingInstructions,
  calories,
  protein,
  carbs,
  fats,
}: BoxProps) => {
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
      <div className="flex justify-around space-x-1">
        <button className="btn btn-success w-10">Like</button>
        <button className="btn flex btn-error w-12 text-xxs">Dislike</button>
        <button className="btn flex w-16 text-xxs gap-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="red"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          Favorite
        </button>
      </div>
    </div>
  );
};

export default Box;
