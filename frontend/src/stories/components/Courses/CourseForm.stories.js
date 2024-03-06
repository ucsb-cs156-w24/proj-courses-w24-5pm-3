import React from "react";

import CourseForm from "main/components/Courses/CourseForm";
import { allTheSubjects } from "fixtures/subjectFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

export default {
  title: "components/Courses/CourseForm",
  component: CourseForm,
  parameters: {
    mockData: [
      {
        url: "/api/UCSBSubjects/all",
        method: "GET",
        status: 200,
        response: allTheSubjects,
      },
      {
        url: "/api/systemInfo",
        method: "GET",
        status: 200,
        response: systemInfoFixtures.showingBothStartAndEndQtr,
      },
    ],
  },
};

const Template = (args) => {
  return <CourseForm {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  submitText: "Create",
  fetchJSON: (_event, data) => {
    console.log("Submit was clicked, data=", data);
  },
};
