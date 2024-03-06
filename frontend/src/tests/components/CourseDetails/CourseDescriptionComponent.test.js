import { render, screen } from "@testing-library/react";
import CourseDescriptionComponent from "main/components/CourseDetails/CourseDescriptionComponent";

describe("CourseDescriptionComponent tests", () => {
  test("renders correctly with a valid course description", () => {
    const course = { description: "This is a test course description." };
    render(<CourseDescriptionComponent course={course} />);
    expect(screen.getByText("Course Description")).toBeInTheDocument();
    expect(screen.getByText(course.description)).toBeInTheDocument();
  });

  test("renders correctly with another test description", () => {
    const course = { description: "Another test description" };
    render(<CourseDescriptionComponent course={course} />);
    expect(screen.getByText("Course Description")).toBeInTheDocument();
    expect(screen.getByText(course.description)).toBeInTheDocument();
  });

  test("empty description", () => {
    const course = { description: "" };
    render(<CourseDescriptionComponent course={course} />);
    expect(screen.getByText("Course Description")).toBeInTheDocument();
    expect(screen.getByText("", { selector: "p" })).toBeInTheDocument();
  });
});
