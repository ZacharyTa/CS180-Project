import React, { useState } from "react";

interface DietaryFormProps {
  initialDietaryPreference?: string;
  initialAllergies?: string[];
  loading: boolean;
  onSubmit: (data: { dietaryPreference: string; allergies: string[] }) => void;
}

const DietaryForm: React.FC<DietaryFormProps> = ({
  initialDietaryPreference = "",
  initialAllergies = [],
  loading,
  onSubmit,
}) => {
  const [dietaryPreference, setDietaryPreference] = useState(
    initialDietaryPreference
  );
  const [allergies, setAllergies] = useState<string[]>(initialAllergies);

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

  const handleCheckboxChange = (allergy: string) => {
    setAllergies((prev) =>
      prev.includes(allergy)
        ? prev.filter((a) => a !== allergy)
        : [...prev, allergy]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ dietaryPreference, allergies });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-base-100 shadow-lg rounded-lg w-full max-w-md"
    >
      <h2 className="text-xl font-semibold mb-4">Dietary Preferences</h2>

      <div className="mb-4">
        <label className="font-medium">Select your dietary preference:</label>
        <div className="flex flex-col space-y-2 mt-2">
          {dietaryOptions.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="dietaryPreference"
                value={option}
                className="radio radio-primary"
                checked={dietaryPreference === option}
                onChange={() => setDietaryPreference(option)}
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="font-medium">Do you have any allergies?</label>
        <div className="flex flex-col space-y-2 mt-2">
          {allergyOptions.map((allergy) => (
            <label
              key={allergy}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                name="allergies"
                value={allergy}
                className="checkbox checkbox-secondary"
                checked={allergies.includes(allergy)}
                onChange={() => handleCheckboxChange(allergy)}
              />
              {allergy}
            </label>
          ))}
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-full mt-4">
        {loading && <span className="loading loading-spinner"></span>}
        Submit
      </button>
    </form>
  );
};

export default DietaryForm;
