import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import RecipeCard from "@/components/recipe-card";

jest.mock("next/image", () => (props) => {
  return <img {...props} />;
});

describe("RecipeCard Component", () => {
  const mockOnClick = jest.fn();

  const props = {
    title: "Test Recipe",
    imgUrl: "/test-image.jpg",
    onClick: mockOnClick,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the title and image correctly", () => {
    render(<RecipeCard {...props} />);

    // Check if the title is displayed
    expect(screen.getByText("Test Recipe")).toBeInTheDocument();

    // Check if the image is rendered (mocked)
    const image = screen.getByRole("img", { name: /test recipe/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("alt", "Test Recipe");
  });

  it("calls `onClick` when the card is clicked", () => {
    render(<RecipeCard {...props} />);

    const card = screen.getByRole("img", {
      name: /test recipe/i,
    }).parentElement;

    if (card) {
      fireEvent.click(card);
    }

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
