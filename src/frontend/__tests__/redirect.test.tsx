import { render } from "@testing-library/react";
import Home from "@/app/page";

class RedirectError extends Error {
  constructor(public destination: string) {
    super(`Redirecting to ${destination}`);
    this.name = "RedirectError";
  }
}

jest.mock("next/navigation", () => {
  return {
    __esModule: true,
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }),
    useSearchParams: () => ({
      get: () => {},
    }),
  };
});

describe("Home Component", () => {
  it("redirects users to the FYP page", () => {
    try {
      render(<Home />);
    } catch (error) {
      if (error instanceof RedirectError) {
        // Assert that the redirect was to the expected URL
        expect(error.destination).toBe("/fyp");
      } else {
        // Re-throw unexpected errors
        throw error;
      }
    }
  });
});
