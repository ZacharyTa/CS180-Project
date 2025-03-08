import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Avatar from "@/components/avatar";
import { supabase } from "@/lib/supabase";

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn().mockReturnValue({
    storage: {
      from: jest.fn().mockReturnValue({
        download: jest.fn(),
        upload: jest.fn(),
      }),
    },
  }),
}));
jest.mock("uuid", () => ({
  v4: jest.fn(() => "mock-uuid"),
}));

const mockUrl = "https://example.com/avatar.jpg";
const mockFile = new File(["test"], "test.png", { type: "image/png" });

describe("Avatar Component", () => {
  const mockOnUpload = jest.fn();
  const mockSize = 100;

  beforeEach(() => {
    jest.clearAllMocks();
    (supabase.storage.from("avatars").download as jest.Mock).mockResolvedValue({
      data: mockFile,
      error: null,
    });
    (supabase.storage.from("avatars").upload as jest.Mock).mockResolvedValue({
      error: null,
    });
    window.URL.createObjectURL = jest.fn(() => "mock-blob-url");
  });

  it("renders with default state", () => {
    render(<Avatar url={null} size={mockSize} onUpload={mockOnUpload} />);

    expect(screen.getByTestId("avatar-container")).toBeInTheDocument();
    expect(screen.queryByAltText("Avatar")).not.toBeInTheDocument();
  });

  it("displays avatar image when url is provided", async () => {
    render(<Avatar url={mockUrl} size={mockSize} onUpload={mockOnUpload} />);

    await waitFor(() => {
      expect(screen.getByAltText("Avatar")).toBeInTheDocument();
    });
  });

  it("toggles dropdown menu when clicked", () => {
    render(<Avatar url={null} size={mockSize} onUpload={mockOnUpload} />);

    const avatarContainer = screen.getByTestId("avatar-container");
    fireEvent.click(avatarContainer);

    expect(screen.getByText("Edit Profile Pic")).toBeInTheDocument();

    fireEvent.click(avatarContainer);
    expect(screen.queryByText("Edit Profile Pic")).not.toBeInTheDocument();
  });

  it("handles file upload successfully", async () => {
    render(<Avatar url={null} size={mockSize} onUpload={mockOnUpload} />);

    // Open dropdown
    fireEvent.click(screen.getByTestId("avatar-container"));

    const fileInput = screen.getByLabelText(
      "Edit Profile Pic"
    ) as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalledWith(
        expect.any(Object),
        "mock-uuid.png"
      );
      expect(supabase.storage.from("avatars").upload).toHaveBeenCalledWith(
        "mock-uuid.png",
        mockFile
      );
    });
  });

  it("shows loading state during upload", async () => {
    render(<Avatar url={null} size={mockSize} onUpload={mockOnUpload} />);

    fireEvent.click(screen.getByTestId("avatar-container"));
    const fileInput = screen.getByLabelText("Edit Profile Pic");

    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    expect(screen.getByText("Uploading ...")).toBeInTheDocument();
  });

  it("handles upload errors", async () => {
    const mockError = new Error("Upload failed");
    (supabase.storage.from("avatars").upload as jest.Mock).mockRejectedValue(
      mockError
    );
    window.alert = jest.fn();

    render(<Avatar url={null} size={mockSize} onUpload={mockOnUpload} />);

    fireEvent.click(screen.getByTestId("avatar-container"));
    const fileInput = screen.getByLabelText("Edit Profile Pic");

    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(mockError);
    });
  });

  it("disables input during upload", async () => {
    render(<Avatar url={null} size={mockSize} onUpload={mockOnUpload} />);

    fireEvent.click(screen.getByTestId("avatar-container"));
    const fileInput = screen.getByLabelText("Edit Profile Pic");

    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    expect(fileInput).toBeDisabled();
  });
});
