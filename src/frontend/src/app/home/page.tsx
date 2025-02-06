import React from "react";
import Test from "@components/Test";
import {Mynerve} from "next/font/google"

const mynerve = Mynerve({
    weight: '400',
    subsets:['latin']});

const HomePage: React.FC = () => (
  
  <div className="min-h-screen bg-white">
    <div className="navbar bg-yellow-200">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
        <li><a>Home</a></li>
        <li><a>Likes</a></li>
        <li><a>Favorites</a></li>
      </ul>
    </div>
  </div>
  <div className="navbar-center">
    <a className={`btn btn-ghost text-xl ${mynerve.className}`}>Munchies</a>
  </div>
  <div className="navbar-end">
    <button className="btn btn-ghost btn-circle">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>
    <button className="btn btn-ghost btn-circle">
      <div className="indicator">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="badge badge-xs badge-primary indicator-item"></span>
      </div>
    </button>
  </div>
</div>
    {/* <div className="text-center mt-4">
     <h1 className={`text-black text-center text-7xl ${mynerve.className}`}>Munchies</h1>
    </div> */}
    
    {/* <div className="card w-96 p-4 bg-base-100 shadow-xl">
      <img
        src="https://img.spoonacular.com/recipes/90629-312x231.jpg"
        alt="Food"
        className="rounded w-full mb-4"
      />
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-red-800">Baked Apples in White Wine</h2>
        <p className="text-sm text-gray-600">
          Calories: 250 | Protein: 10g | Carbs: 30g | Fat: 8g
        </p>
      </div>
      <div className="flex justify-around">
        <button className="btn btn-success">Like</button>
        <button className="btn btn-error">Dislike</button>
      </div>
    </div> */}
    <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
      <Test title={"Fresh Corn"} imgUrl={"https://img.spoonacular.com/recipes/643462-556x370.jpg"} calories={"30"}protein={"20g"}carbs={"5g"}fats={"2g"}/>
      <Test title={"Cajun Lobster Pasta"} imgUrl={"https://img.spoonacular.com/recipes/636732-556x370.jpg"} calories={"734"}protein={"36g"}carbs={"39g"}fats={"50g"}/>
      <Test title={"Baked Rice Custard"} imgUrl={"https://img.spoonacular.com/recipes/633758-556x370.jpg"} calories={"393"}protein={"8g"}carbs={"74g"}fats={"6g"}/>
      <Test title={"Murg Malai Tikka"} imgUrl={"https://img.spoonacular.com/recipes/652598-556x370.jpg"} calories={"375"}protein={"35g"}carbs={"6g"}fats={"23g"}/>
    </div>
  </div>
);

export default HomePage;
