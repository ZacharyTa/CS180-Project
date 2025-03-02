export interface Recipe {
  id: number;
  recipeName: string;
  cookingInstructions: string;
  imageURL: string;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  allergensList: string[];
}
