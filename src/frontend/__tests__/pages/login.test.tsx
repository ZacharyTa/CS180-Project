import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import Login from "@/app/login/page";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// Mock external dependencies
jest.mock("@supabase/supabase-js", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signInWithOAuth: jest.fn(),
    },
  },
}));
jest.mock("uuid", () => ({
  v4: jest.fn(() => "mock-uuid"),
}));

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => ({
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signInWithOAuth: jest.fn(),
    },
  })),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Login Page", () => {
  const push = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push });
  });

  it("renders login form elements", () => {
    render(<Login />);
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/sign in with google/i)).toBeInTheDocument();
  });

  it("calls handleLogin and redirects on successful sign in", async () => {
    const signInResponse = { error: null };
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue(
      signInResponse
    );

    render(<Login />);
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const signInButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(push).toHaveBeenCalledWith("/fyp");
    });
  });

  it("calls handleSignUp and alerts on successful sign up", async () => {
    const signUpResponse = { error: null };
    (supabase.auth.signUp as jest.Mock).mockResolvedValue(signUpResponse);
    window.alert = jest.fn();

    render(<Login />);
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const signUpButton = screen.getByRole("button", { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: "new@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "newpassword" } });
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: "new@example.com",
        password: "newpassword",
      });
      expect(window.alert).toHaveBeenCalledWith(
        "Check your email for a confirmation link!"
      );
    });
  });

  it("calls handleGoogleLogin when clicking Sign In With Google", async () => {
    const oAuthResponse = { error: null };
    (supabase.auth.signInWithOAuth as jest.Mock).mockResolvedValue(
      oAuthResponse
    );

    render(<Login />);
    const googleLoginText = screen.getByText(/sign in with google/i);
    fireEvent.click(googleLoginText);

    await waitFor(() => {
      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: "google",
        options: {
          redirectTo: "http://localhost:3000/fyp",
        },
      });
    });
  });

  it("disables button and shows loading state during login", async () => {
    // Create a promise to simulate a delayed response
    let resolvePromise: (value: { error: null } | { error: string }) => void;
    const signInPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    (supabase.auth.signInWithPassword as jest.Mock).mockReturnValue(
      signInPromise
    );

    render(<Login />);
    const signInButton = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(signInButton);

    // The button should display "Signing in..." while loading
    expect(signInButton).toHaveTextContent("Signing in...");

    await act(async () => {
      resolvePromise({ error: null });
    });
    await waitFor(() => {
      expect(push).toHaveBeenCalledWith("/fyp");
    });
  });
});
