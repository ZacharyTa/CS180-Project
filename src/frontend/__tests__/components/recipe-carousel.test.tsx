import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import RecipeCarousel from "@/components/recipe-carousel";

// Mock embla-carousel-react
const mockOn = jest.fn();
const mockOff = jest.fn();
const mockSelectedScrollSnap = jest.fn();
const mockScrollSnapList = jest.fn(() => [0, 1, 2]); // 3 slides

jest.mock("embla-carousel-react", () => ({
  __esModule: true,
  default: jest.fn(() => [
    jest.fn(), // Mock emblaRef
    {
      scrollSnapList: mockScrollSnapList,
      selectedScrollSnap: mockSelectedScrollSnap,
      on: mockOn,
      off: mockOff,
    },
  ]),
}));

describe("RecipeCarousel", () => {
  let onLastSlideMock: jest.Mock;

  beforeEach(() => {
    onLastSlideMock = jest.fn();
    mockOn.mockClear();
    mockOff.mockClear();
    mockSelectedScrollSnap.mockClear();
  });

  it("renders the carousel component with children", () => {
    render(
      <RecipeCarousel onLastSlide={onLastSlideMock}>
        <div data-testid="slide-1">Slide 1</div>
        <div data-testid="slide-2">Slide 2</div>
        <div data-testid="slide-3">Slide 3</div>
      </RecipeCarousel>
    );

    expect(screen.getByTestId("slide-1")).toBeInTheDocument();
    expect(screen.getByTestId("slide-2")).toBeInTheDocument();
    expect(screen.getByTestId("slide-3")).toBeInTheDocument();
  });

  it("calls `onLastSlide` when reaching the last slide", () => {
    // Simulate last slide
    mockSelectedScrollSnap.mockReturnValue(2);

    render(
      <RecipeCarousel onLastSlide={onLastSlideMock}>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </RecipeCarousel>
    );

    expect(onLastSlideMock).toHaveBeenCalledTimes(1);
  });

  it("does not call `onLastSlide` if not on the last slide", () => {
    mockSelectedScrollSnap.mockReturnValue(1);

    render(
      <RecipeCarousel onLastSlide={onLastSlideMock}>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </RecipeCarousel>
    );

    expect(onLastSlideMock).toHaveBeenCalledTimes(0);
  });
});
