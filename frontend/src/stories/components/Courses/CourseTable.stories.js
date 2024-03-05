import React from "react";

import CourseTable from "main/components/Courses/CourseTable";
import { coursesFixtures } from "fixtures/pscourseFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

export default {
  title: "components/Courses/CourseTable",
  component: CourseTable,
};

const Template = (args) => {
  return <CourseTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  courses: [],
};

export const twoPSCourses = Template.bind({});
twoPSCourses.args = {
  courses: coursesFixtures.twoCourses,
  currentUser: currentUserFixtures.userOnly,
};
