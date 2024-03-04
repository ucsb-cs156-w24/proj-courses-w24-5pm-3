import React from "react";

export default function CourseDescriptionComponent({ course }) {
  return (
    <div>
        
      <h4>Course Description</h4>

      <p>{course.description}</p>

    </div>
  );
}