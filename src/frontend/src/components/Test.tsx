import React from "react";
import Image from "next/image";
// import {Mynerve} from "next/font/google"

// const mynerve = Mynerve({
//     weight: '400',
//     subsets:['latin']});

const Box = ({id,recipeName,cookingInstructions,imageUrl,calories,protein,fats,carbs,allergensList}) => {
    return (
        <div className= "card w-48 p-4 bg-yellow-200 shadow-xl float-left">
            <div>
                {/* <p className=" text-center mb-4 text-blue-800">Title is: {title}</p> */}
                <img src= {imageUrl}
                width = {500}
                height ={500} 
                alt={recipeName}/>
                <h1 className= "text-xl text-center text-black font-bold"> {recipeName}</h1>
                <h2 className = "text-s text-center text-black">
                    Calories: {calories} | Protein: {protein} | Carbs: {carbs} | Fats: {fats}
                </h2>
                <h2 className="text-s text-center text-black">
                    Allergens: {allergensList}
                </h2>
                <h2 className="text-s text-center text-black">
                    Intructions:
                    <p className=" text-xs text-justified">{cookingInstructions}</p>
                </h2>
                <h3 className="text-xs text-right text-black">
                    ID: {id}
                </h3>
            </div>
            <div className="flex justify-around space-x-1">
              <button className="btn btn-success w-40">Like</button>
            </div>
        </div>

    );
}

export default Box;