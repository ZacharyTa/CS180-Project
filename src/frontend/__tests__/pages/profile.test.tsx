import "@testing-library/jest-dom";
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import ProfilePage from "@/app/profile/page";
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
jest.mock("@/components/Account", () => {
  const AccountMock = ({ session }: { session: any }) => (
    <div data-testid="account">
      Account Component - {session ? "Session Active" : "No Session"}
    </div>
  );
  AccountMock.displayName = "AccountMock";
  return AccountMock;
});
jest.mock("@/components/recipe-card", () => {
  const RecipeCardMock = ({
    title,
    onClick,
  }: {
    title: string;
    onClick: () => void;
  }) => (
    <button data-testid="recipe-card" onClick={onClick}>
      {title}
    </button>
  );
  RecipeCardMock.displayName = "RecipeCardMock";
  return RecipeCardMock;
});
jest.mock("@/components/test-recipe", () => {
  const TestRecipeMock = ({ title }: { title: string }) => (
    <div data-testid="modal-recipe">{title}</div>
  );
  TestRecipeMock.displayName = "TestRecipeMock";
  return TestRecipeMock;
});

describe("ProfilePage Component", () => {
  const mockRecipes = [
    {
      id: "1",
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
      id: "2",
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

  it("renders ProfilePage components (TabBar, Account, Recipe Grid)", async () => {
    fetchRecipes.mockResolvedValue(mockRecipes);
    useAuth.mockReturnValue({
      user: { id: "user-123", email: "test@example.com" },
      session: {},
    });

    await act(async () => {
      render(<ProfilePage />);
    });

    expect(screen.getByTestId("tab-bar")).toBeInTheDocument();
    expect(screen.getByTestId("account")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("fetches and displays liked recipes when user is authenticated", async () => {
    fetchRecipes.mockResolvedValue(mockRecipes);
    useAuth.mockReturnValue({ user: { id: "user-123" }, session: {} });

    await act(async () => {
      render(<ProfilePage />);
    });

    await waitFor(() => {
      expect(screen.getByText("Recipe 1")).toBeInTheDocument();
      expect(screen.getByText("Recipe 2")).toBeInTheDocument();
    });
  });

  it("does not display recipes when the user is not authenticated", async () => {
    fetchRecipes.mockResolvedValue(mockRecipes);
    useAuth.mockReturnValue({ user: null, session: null });

    await act(async () => {
      render(<ProfilePage />);
    });

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByTestId("recipe-card")).not.toBeInTheDocument();
  });

  it("opens modal when a recipe card is clicked", async () => {
    fetchRecipes.mockResolvedValue(mockRecipes);
    useAuth.mockReturnValue({ user: { id: "user-123" }, session: {} });

    await act(async () => {
      render(<ProfilePage />);
    });

    // Click the first recipe card to open modal
    await act(async () => {
      fireEvent.click(screen.getByText("Recipe 1"));
    });

    expect(screen.getByTestId("modal-recipe")).toHaveTextContent("Recipe 1");
  });

  it("closes modal when close button is clicked", async () => {
    fetchRecipes.mockResolvedValue(mockRecipes);
    useAuth.mockReturnValue({ user: { id: "user-123" }, session: {} });

    await act(async () => {
      render(<ProfilePage />);
    });

    // Open the modal
    await act(async () => {
      fireEvent.click(screen.getByText("Recipe 1"));
    });

    expect(screen.getByTestId("modal-recipe")).toBeInTheDocument();

    // Close the modal
    await act(async () => {
      fireEvent.click(screen.getByText("✕"));
    });

    expect(screen.queryByTestId("modal-recipe")).not.toBeInTheDocument();
  });
});
