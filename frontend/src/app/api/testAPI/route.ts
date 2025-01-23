import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch(
    "https://api.spoonacular.com/recipes/findByNutrients?minCarbs=10&maxCarbs=50&number=2"
  );
  const data = await response.json();
  return NextResponse.json(data);
}
