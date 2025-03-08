import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import DietaryForm from "@/components/diet-form";
import Cookies from "js-cookie";

// Mock external dependencies
jest.mock("js-cookie");

const dietaryOptions = [
  "High Protein",
  "Low Fat",
  "Low Carb",
  "Keto",
  "Low Calories",
];
const allergyOptions = [
  "Dairy",
  "Peanuts",
  "Gluten",
  "Meat",
  "Shellfish",
  "Egg",
];

describe("DietaryForm Component", () => {
  const onSubmitMock = jest.fn();
  const initialAllergies = ["Dairy", "Peanuts"];
  const initialPreference = "Low Carb";

  beforeEach(() => {
    jest.clearAllMocks();
    (Cookies.set as jest.Mock).mockClear();
  });

  it("renders with initial values", () => {
    render(
      <DietaryForm
        initialDietaryPreference={initialPreference}
        initialAllergies={initialAllergies}
        loading={false}
        onSubmit={onSubmitMock}
      />
    );

    // Check initial dietary preference
    const checkedRadio = screen.getByRole("radio", { checked: true });
    expect(checkedRadio).toBeChecked();

    // Check initial allergies
    allergyOptions.forEach((allergy) => {
      const checkbox = screen.getByLabelText(allergy) as HTMLInputElement;
      expect(checkbox.checked).toBe(initialAllergies.includes(allergy));
    });
  });

  it("updates dietary preference when radio buttons are clicked", () => {
    render(<DietaryForm loading={false} onSubmit={onSubmitMock} />);

    dietaryOptions.forEach((option) => {
      const radio = screen.getByLabelText(option);
      fireEvent.click(radio);
      expect(radio).toBeChecked();
    });
  });

  it("toggles allergy checkboxes correctly", () => {
    render(<DietaryForm loading={false} onSubmit={onSubmitMock} />);

    allergyOptions.forEach((allergy) => {
      const checkbox = screen.getByLabelText(allergy);
      // First click - check
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
      // Second click - uncheck
      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
  });

  it("submits form with correct data", () => {
    render(<DietaryForm loading={false} onSubmit={onSubmitMock} />);

    fireEvent.click(screen.getByLabelText("Keto"));
    fireEvent.click(screen.getByLabelText("Gluten"));
    fireEvent.click(screen.getByLabelText("Shellfish"));

    // Updated submission method
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(onSubmitMock).toHaveBeenCalledWith({
      dietaryPreference: "Keto",
      allergies: ["Gluten", "Shellfish"],
    });
  });

  it("sets cookie on submit", () => {
    render(<DietaryForm loading={false} onSubmit={onSubmitMock} />);
    // Updated submission method
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(Cookies.set).toHaveBeenCalledWith(
      "currentRecipeIds",
      JSON.stringify([])
    );
  });

  it("handles empty initial state", () => {
    render(<DietaryForm loading={false} onSubmit={onSubmitMock} />);

    // No radio should be checked initially
    dietaryOptions.forEach((option) => {
      expect(screen.getByLabelText(option)).not.toBeChecked();
    });

    // No checkboxes should be checked
    allergyOptions.forEach((allergy) => {
      expect(screen.getByLabelText(allergy)).not.toBeChecked();
    });
  });
});
