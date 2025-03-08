import "@testing-library/jest-dom";
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import Account from "@/components/Account";
import { supabase } from "@/lib/supabase";

// Create a persistent mock for the "profiles" table.
const profilesMock = {
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({
    data: { avatar_url: "/test-avatar.jpg" },
    error: null,
  }),
  upsert: jest.fn().mockResolvedValue({ error: null }),
};

// Ensure supabase.from("profiles") always returns the same mock object.
jest.mock("@/lib/supabase", () => ({
  __esModule: true,
  supabase: {
    from: jest.fn((table) => {
      if (table === "profiles") return profilesMock;
      return {};
    }),
    auth: {
      signOut: jest.fn(),
    },
  },
}));

// Modify the Avatar mock to simulate onUpload when clicked.
jest.mock("@/components/Avatar", () => (props) => {
  return (
    <img
      data-testid="avatar"
      src={props.url || "/default-avatar.jpg"}
      alt="User Avatar"
      onClick={() => {
        if (props.onUpload) {
          // Simulate an upload with a new avatar URL.
          props.onUpload(new Event("click"), "/new-avatar.jpg");
        }
      }}
    />
  );
});

describe("Account Component", () => {
  const mockSession = { user: { id: "user-123" } };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches and displays the user's avatar", async () => {
    await act(async () => {
      render(<Account session={mockSession} />);
    });

    // Wait for the useEffect to update the avatar.
    await waitFor(() => {
      expect(screen.getByTestId("avatar")).toHaveAttribute(
        "src",
        "/test-avatar.jpg"
      );
    });
  });

  it("calls updateProfile when a new avatar is uploaded", async () => {
    await act(async () => {
      render(<Account session={mockSession} />);
    });

    // Ensure initial avatar is rendered.
    await waitFor(() => {
      expect(screen.getByTestId("avatar")).toHaveAttribute(
        "src",
        "/test-avatar.jpg"
      );
    });

    // Click the avatar to trigger the onUpload callback.
    await act(async () => {
      fireEvent.click(screen.getByTestId("avatar"));
    });

    // Wait for upsert to be called with the new avatar details.
    await waitFor(() => {
      expect(profilesMock.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "user-123",
          avatar_url: "/new-avatar.jpg",
          updated_at: expect.any(Date),
        })
      );
    });

    // Confirm that the avatar image has been updated in the UI.
    await waitFor(() => {
      expect(screen.getByTestId("avatar")).toHaveAttribute(
        "src",
        "/new-avatar.jpg"
      );
    });
  });

  it("calls signOut when the sign-out button is clicked", async () => {
    await act(async () => {
      render(<Account session={mockSession} />);
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Sign Out"));
    });

    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
  });
});
