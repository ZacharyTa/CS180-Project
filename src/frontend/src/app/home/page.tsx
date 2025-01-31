import React from "react";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 p-4 bg-base-100 shadow-xl">
        <img
          src="https://www.simplyrecipes.com/thmb/Boo37yZBqeSpmELBIP_BBX_yVlU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Spaghetti-And-Meatballs-LEAD-3-40bdae68ea144751a8e0a4b0f972af2d.jpg"
          alt="Food"
          className="rounded w-full mb-4"
        />
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold">Delicious Recipe</h2>
          <p className="text-sm text-gray-600">
            Calories: 250 | Protein: 10g | Carbs: 30g | Fat: 8g
          </p>
        </div>
        <div className="flex justify-around">
          <button className="btn btn-success">Like</button>
          <button className="btn btn-error">Dislike</button>
        </div>
      </div>
    </div>
  );
}
