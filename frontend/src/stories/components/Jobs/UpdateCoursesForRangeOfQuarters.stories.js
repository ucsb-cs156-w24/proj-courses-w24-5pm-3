import React from "react";

import UpdateCoursesForRangeOfQuartersJobForm from "main/components/Jobs/UpdateCoursesForRangeOfQuartersJobForm";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

export default {
  title: "components/Jobs/UpdateCoursesForRangeOfQuartersJobForm",
  component: UpdateCoursesForRangeOfQuartersJobForm,
  parameters: {
    mockData: [
      {
        url: "/api/systemInfo",
        method: "GET",
        status: 200,
        response: systemInfoFixtures.showingBoth,
      },
    ],
  },
};

const Template = (args) => {
  return <UpdateCoursesForRangeOfQuartersJobForm {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  callback: (data) => {
    console.log("Submit was clicked, data=", data);
  },
};
