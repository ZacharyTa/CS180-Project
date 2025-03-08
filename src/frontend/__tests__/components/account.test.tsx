import "@testing-library/jest-dom";
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import Account from "@/components/account";
import type { User, Session } from "@supabase/supabase-js";

const profilesMock = {
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({
    data: { avatar_url: "/default-avatar.jpg" },
    error: null,
  }),
  upsert: jest.fn().mockResolvedValue({ error: null }),
};

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

jest.mock("@/components/avatar", () => (props) => {
  return (
    <img
      data-testid="avatar"
      src={props.url || "/default-avatar.jpg"}
      alt="User Avatar"
      onClick={() => {
        if (props.onUpload) {
          // Simulate a proper change event
          const mockEvent = {
            target: {},
            preventDefault: jest.fn(),
          };
          props.onUpload(mockEvent, "/new-avatar.jpg");
        }
      }}
    />
  );
});
describe("Account Component", () => {
  const mockUser: User = {
    id: "user-123",
    app_metadata: {},
    user_metadata: {},
    aud: "aud-456",
    created_at: "2021-01-01T00:00:00.000Z",
  };

  const mockSession: Session = {
    provider_token: null,
    provider_refresh_token: null,
    access_token: "access-token-123",
    refresh_token: "refresh-token-456",
    expires_in: 3600, // 1 hr
    expires_at: Date.now() + 3600 * 1000,
    token_type: "Bearer",
    user: mockUser,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches and displays the user's avatar", async () => {
    await act(async () => {
      render(<Account user={mockSession.user} session={mockSession} />);
    });

    await waitFor(() => {
      expect(screen.getByTestId("avatar")).toHaveAttribute(
        "src",
        "/default-avatar.jpg"
      );
    });
  });

  it("calls updateProfile when a new avatar is uploaded", async () => {
    await act(async () => {
      render(<Account user={mockSession.user} session={mockSession} />);
    });

    await waitFor(() => {
      expect(screen.getByTestId("avatar")).toHaveAttribute(
        "src",
        "/default-avatar.jpg"
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("avatar"));
    });

    await waitFor(() => {
      expect(profilesMock.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "user-123",
          avatar_url: "/new-avatar.jpg",
          updated_at: expect.any(Date),
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId("avatar")).toHaveAttribute(
        "src",
        "/new-avatar.jpg"
      );
    });
  });
});
