import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import TabBar from "@/components/tab-bar";
import { supabase } from "@/lib/supabase";

const pushMock = jest.fn();

jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      signOut: jest.fn(),
    },
  },
}));

jest.mock("lucide-react", () => ({
  Heart: () => <div data-testid="heart-icon" />,
  Home: () => <div data-testid="home-icon" />,
  LogOut: () => <div data-testid="logout-icon" />,
}));

jest.mock("next/navigation", () => {
  return {
    __esModule: true,
    useRouter: () => ({
      push: pushMock,
      replace: jest.fn(),
      prefetch: jest.fn(),
    }),
    useSearchParams: () => ({
      get: () => {},
    }),
    usePathname: () => "localhost:3000",
  };
});

describe("Ensure all components are properly rendering", () => {
  beforeEach(() => {
    pushMock.mockClear(); // Clear previous calls before each test
  });

  it("Checking if TabBar shows FYP/Profile", () => {
    render(<TabBar />);
    expect(screen.getByText("For You")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("TabBar Navigation -> For You", () => {
    render(<TabBar />);
    const forYouButton = screen.getByRole("tab", { name: /For You/i });
    fireEvent.click(forYouButton);
    expect(pushMock).toHaveBeenCalledWith("/fyp");
  });

  it("TabBar Navigation -> Profile", () => {
    render(<TabBar />);
    const forYouButton = screen.getByRole("tab", { name: /Profile/i });
    fireEvent.click(forYouButton);
    expect(pushMock).toHaveBeenCalledWith("/profile");
  });
  it("TabBar Navigation -> Logout", () => {
    render(<TabBar />);
    const logoutButton = screen.getByRole("tab", { name: /Logout/i });
    fireEvent.click(logoutButton);
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});
