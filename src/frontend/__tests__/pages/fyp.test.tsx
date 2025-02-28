import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import FYPPage from "@/app/fyp/page";
import { fetchRecipes } from "@/app/api";
import { useAuth } from "@/context/authContext";

// Mock API and Auth Context
jest.mock("@/app/api", () => ({
  fetchRecipes: jest.fn(),
}));

jest.mock("@/context/authContext", () => ({
  useAuth: jest.fn(),
}));

// Mock child components
jest.mock("@/components/tab-bar", () => {
  const TabBarMock = () => <div data-testid="tab-bar">TabBar</div>;
  TabBarMock.displayName = "TabBarMock";
  return TabBarMock;
});
jest.mock("@/components/recipe-carousel", () => {
  const RecipeCarouselMock = ({
    onLastSlide,
    children,
  }: {
    onLastSlide: () => void;
    children: React.ReactNode;
  }) => (
    <div data-testid="recipe-carousel">
      {children}
      <button onClick={onLastSlide} data-testid="load-more">
        Load More
      </button>
    </div>
  );
  RecipeCarouselMock.displayName = "RecipeCarouselMock";
  return RecipeCarouselMock;
});
jest.mock("@/components/test-recipe", () => {
  const TestRecipeMock = ({ title }: { title: string }) => (
    <div data-testid="recipe-box">{title}</div>
  );
  TestRecipeMock.displayName = "TestRecipeMock";
  return TestRecipeMock;
});

describe("FYPPage Component", () => {
  const mockRecipes = [
    {
      id: 1,
      recipeName: "Recipe 1",
      imageURL: "/recipe1.jpg",
      cookingInstructions: "Cook it well",
      calories: 300,
      protein: 20,
      carbs: 50,
      fats: 10,
      allergensList: [],
    },
    {
      id: 2,
      recipeName: "Recipe 2",
      imageURL: "/recipe2.jpg",
      cookingInstructions: "Mix it up",
      calories: 400,
      protein: 30,
      carbs: 60,
      fats: 15,
      allergensList: [],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders TabBar and RecipeCarousel", async () => {
    (fetchRecipes as jest.Mock).mockResolvedValue(mockRecipes);
    (useAuth as jest.Mock).mockReturnValue({ user: { id: "user-123" } });

    await act(async () => {
      render(<FYPPage />);
    });

    expect(screen.getByTestId("tab-bar")).toBeInTheDocument();
    expect(screen.getByTestId("recipe-carousel")).toBeInTheDocument();
  });

  it("fetches and displays initial recipes when user is authenticated", async () => {
    (fetchRecipes as jest.Mock).mockResolvedValue(mockRecipes);
    (useAuth as jest.Mock).mockReturnValue({ user: { id: "user-123" } });

    await act(async () => {
      render(<FYPPage />);
    });

    await waitFor(() => {
      // assert that the two Box components are rendered, based on the mockRecipes data
      expect(screen.getAllByTestId("recipe-box")).toHaveLength(
        mockRecipes.length
      );
    });
  });

  it("does not display recipes when the user is not authenticated", async () => {
    (fetchRecipes as jest.Mock).mockResolvedValue(mockRecipes);
    (useAuth as jest.Mock).mockReturnValue({ user: null });

    await act(async () => {
      render(<FYPPage />);
    });

    expect(screen.queryByTestId("recipe-box")).not.toBeInTheDocument();
  });

  it("calls loadMoreRecipes when the last slide is reached", async () => {
    (fetchRecipes as jest.Mock).mockResolvedValue(mockRecipes);
    (useAuth as jest.Mock).mockReturnValue({ user: { id: "user-123" } });

    await act(async () => {
      render(<FYPPage />);
    });

    // Click the "Load More" button to trigger loadMoreRecipes
    await act(async () => {
      screen.getByTestId("load-more").click();
    });

    expect(fetchRecipes).toHaveBeenCalledTimes(2); // One for initial load, one for loadMoreRecipes
  });
});
