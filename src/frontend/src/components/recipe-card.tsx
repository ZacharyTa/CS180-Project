import React from "react";
import Image from "next/image";

interface RecipeCardProps {
  title: string;
  imgUrl: string;
  onClick: () => void;
}

const RecipeCard = ({ title, imgUrl, onClick }: RecipeCardProps) => {
  return (
    <div
      className="card p-4 bg-yellow-200 shadow-xl float-left w-full h-full"
      onClick={onClick}
    >
      <div>
        {/* <p className=" text-center mb-4 text-blue-800">Title is: {title}</p> */}
        <Image src={imgUrl} width={500} height={500} alt={title} />
        <h1 className="text-xl text-center text-black font-bold"> {title}</h1>
      </div>
    </div>
  );
};

export default RecipeCard;
