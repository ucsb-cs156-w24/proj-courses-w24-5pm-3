import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import {
  convertToFraction,
  formatInstructors,
  formatLocation,
  formatTime,
} from "main/utils/sectionUtils.js";
import {
    cellToAxiosParamsDelete,
    onDeleteSuccess,
  } from "main/utils/CoursesEditUtils";
import { hasRole } from "main/utils/currentUser";

export default function PersonalSectionsEditTable({ personalSections, currentUser, psId }) {
  // Stryker disable all : hard to test for query caching
  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    [],
  );
  // Stryker restore all

  // Stryker disable next-line all : TODO try to make a good test for this
  const deleteCallback = async (cell) => {
    const mutationArgs = { cell, psId };
    deleteMutation.mutate(mutationArgs);
  };

  const columns = [
    {
      Header: "Course ID",
      accessor: "courseId",
    },
    {
      Header: "Enroll Code",
      accessor: "classSections[0].enrollCode",
    },
    {
      Header: "Section",
      accessor: "classSections[0].section",
    },
    {
      Header: "Title",
      accessor: "title",
    },
    {
      Header: "Enrolled",
      accessor: (row) =>
        convertToFraction(
          row.classSections[0].enrolledTotal,
          row.classSections[0].maxEnroll,
        ),
      id: "enrolled",
    },
    {
      Header: "Location",
      accessor: (row) => formatLocation(row.classSections[0].timeLocations),
      id: "location",
    },
    {
      Header: "Days",
      accessor: "classSections[0].timeLocations[0].days",
    },
    {
      Header: "Time",
      accessor: (row) => formatTime(row.classSections[0].timeLocations),
      id: "time",
    },
    {
      Header: "Instructor",
      accessor: (row) => formatInstructors(row.classSections[0].instructors),
      id: "instructor",
    },
  ];

  const columnsIfUser = [
    ...columns,
    // Stryker disable next-line all
    ButtonColumn("Delete", "danger", deleteCallback, "PersonalSectionsEditTable"),
  ];

  const testid = "PersonalSectionsEditTable";

  const columnsToDisplay = hasRole(currentUser, "ROLE_USER")
    ? columnsIfUser
    : columns;

  return (
    <OurTable
      data={personalSections}
      columns={columnsToDisplay}
      testid={testid}
    />
  );
}
