import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Box from "@/components/test-recipe";
import { Recipe } from "@/lib/types/recipe";
import {
  likeRecipe,
  unlikeRecipe,
  dislikeRecipe,
  undislikeRecipe,
} from "@/app/api";

// Mock API functions
jest.mock("@/app/api", () => ({
  likeRecipe: jest.fn(),
  unlikeRecipe: jest.fn(),
  dislikeRecipe: jest.fn(),
  undislikeRecipe: jest.fn(),
}));

const mockRecipe: Recipe = {
  id: 1,
  recipeName: "Test Recipe",
  imageURL: "/test-image.jpg",
  cookingInstructions: "Test cooking instructions",
  calories: 500,
  protein: 30,
  carbs: 50,
  fats: 20,
  allergensList: ["Dairy", "Gluten"],
};

describe("Box Component", () => {
  const userId = "user-123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders recipe details correctly", () => {
    render(<Box userId={userId} recipe={mockRecipe} isProfile={false} />);

    expect(screen.getByText("Test Recipe")).toBeInTheDocument();
    expect(
      screen.getByText("Calories: 500 | Protein: 30 | Carbs: 50 | Fats: 20")
    ).toBeInTheDocument();
    expect(screen.getByText("Dairy, Gluten")).toBeInTheDocument();
    expect(screen.getByText("Test cooking instructions")).toBeInTheDocument();
  });

  it("displays 'None' when no allergens are present", () => {
    const noAllergensRecipe = { ...mockRecipe, allergensList: [] };
    render(
      <Box userId={userId} recipe={noAllergensRecipe} isProfile={false} />
    );

    expect(screen.getByText("None")).toBeInTheDocument();
  });

  it("toggles like button and calls correct API functions", () => {
    render(<Box userId={userId} recipe={mockRecipe} isProfile={false} />);

    const likeButton = screen.getByRole("like", { name: /like/i });

    // First click - like
    fireEvent.click(likeButton);
    expect(likeRecipe).toHaveBeenCalledWith(userId, mockRecipe.id);

    // Second click - unlike
    fireEvent.click(likeButton);
    expect(unlikeRecipe).toHaveBeenCalledWith(userId, mockRecipe.id);
  });

  it("toggles dislike button and calls correct API functions", () => {
    render(<Box userId={userId} recipe={mockRecipe} isProfile={false} />);

    const dislikeButton = screen.getByRole("dislike", { name: /dislike/i });

    // First click - dislike
    fireEvent.click(dislikeButton);
    expect(dislikeRecipe).toHaveBeenCalledWith(userId, mockRecipe.id);

    // Second click - undislike
    fireEvent.click(dislikeButton);
    expect(undislikeRecipe).toHaveBeenCalledWith(userId, mockRecipe.id);
  });

  it("disables dislike button when liked and vice versa", () => {
    render(<Box userId={userId} recipe={mockRecipe} isProfile={false} />);

    const likeButton = screen.getByRole("like", { name: /like/i });
    const dislikeButton = screen.getByRole("dislike", { name: /dislike/i });

    // Initially both enabled
    expect(likeButton).not.toBeDisabled();
    expect(dislikeButton).not.toBeDisabled();

    // Like and check dislike is disabled
    fireEvent.click(likeButton);
    expect(dislikeButton).toBeDisabled();

    // Unlike and enable both
    fireEvent.click(likeButton);
    expect(dislikeButton).not.toBeDisabled();

    // Dislike and check like is disabled
    fireEvent.click(dislikeButton);
    expect(likeButton).toBeDisabled();
  });

  it("initializes liked state based on isProfile prop", () => {
    const { rerender } = render(
      <Box userId={userId} recipe={mockRecipe} isProfile={true} />
    );
    expect(screen.getByRole("like", { name: /like/i })).toHaveClass(
      "btn-error"
    );

    rerender(<Box userId={userId} recipe={mockRecipe} isProfile={false} />);
    expect(screen.getByRole("dislike", { name: /like/i })).not.toHaveClass(
      "btn-error"
    );
  });
});
