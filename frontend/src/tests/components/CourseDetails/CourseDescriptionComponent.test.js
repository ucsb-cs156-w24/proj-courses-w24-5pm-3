import { render, screen } from "@testing-library/react";
import CourseDescriptionComponent from "main/components/CourseDetails/CourseDescriptionComponent";

describe("CourseDescriptionComponent tests", () => {
  test("renders without crashing with a valid course description", () => {
    const course = { description: "This is a test course description." };
    render(<CourseDescriptionComponent course={course} />);
    expect(screen.getByText("Course Description")).toBeInTheDocument();
    expect(screen.getByText(course.description)).toBeInTheDocument();
  });

  test("renders", () => {
    const course = { description: "Another test description" };
    render(<CourseDescriptionComponent course={course} />);
    expect(screen.getByText("Course Description")).toBeInTheDocument();
    expect(screen.getByText(course.description)).toBeInTheDocument();
  });

});