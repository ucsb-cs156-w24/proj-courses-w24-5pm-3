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

export const onePSCourse = Template.bind({});

onePSCourse.args = {
  courses: coursesFixtures.oneCourse,
  currentUser: currentUserFixtures.userOnly,
};

export const twoPSCourses = Template.bind({});
twoPSCourses.args = {
  courses: coursesFixtures.twoCourses,
  currentUser: currentUserFixtures.userOnly,
};
