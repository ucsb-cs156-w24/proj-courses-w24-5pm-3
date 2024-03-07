import SectionsTableBase from "main/components/SectionsTableBase";
import PersonalScheduleDropdown from "../PersonalSchedules/PersonalScheduleDropdown";

// import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { yyyyqToQyy } from "main/utils/quarterUtilities.js";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import {
  convertToFraction,
  formatDays,
  formatInstructors,
  formatLocation,
  formatTime,
  isSection,
  formatStatus,
  formatInfoLink,
  renderInfoLink,
} from "main/utils/sectionUtils.js";

function getFirstVal(values) {
  return values[0];
}

export default function SectionsTable({ sections }) {
  // Stryker restore all
  // Stryker disable BooleanLiteral
  const [showModal, setShowModal] = useState(false);
  const [fetchSchedules, setFetchSchedules] = useState(false);
  const [selectedEnrollCode, setSelectedEnrollCode] = useState("");

  const handleShow = () => {
    setShowModal(true);
    setFetchSchedules(true);
  };
  const handleClose = () => {
    setShowModal(false);
    setFetchSchedules(false);
  };

  const {
    data: schedules,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/personalschedules/all"],
    // Stryker disable next-line all : don't test internal caching of React Query
    { method: "GET", url: "/api/personalschedules/all" },
    [],
    // Stryker disable next-line all : testing this would be hard as it has a default value of true in utils/useBackend.js
    { enabled: fetchSchedules }, // only calls useBackend when the modal is opened so that we dont get constant backend calls failure when not signed in
  );

  // Stryker disable all : not sure how to test/mock local storage
  const localSchedule = localStorage.getItem("ModalForm-psId");
  const [schedule, setSchedule] = useState(localSchedule || "");
  if (schedule) {
    localStorage.setItem("ModalForm-psId", schedule);
  }
  // Stryker restore all

  useEffect(() => {
    if (schedules && schedules.length > 0 && !localSchedule) {
      setSchedule(schedules[0].id);
      // Stryker disable all : not sure how to test/mock local storage
      localStorage.setItem("ModalForm-psId", schedules[0].id);
      // Stryker restore all
    }
  }, [schedules, localSchedule]);

  const objectToAxiosParams = (course) => ({
    url: "/api/courses/post",
    method: "POST",
    params: {
      enrollCd: course.enrollCd,
      psId: course.psId.psId,
    },
  });

  const onSuccess = (course) => {
    toast(
      `New course Created - id: ${course[0].id} enrollCd: ${course[0].enrollCd}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    // ["/api/courses/user/all"],
  );

  const addCallback = (section) => {
    if (section.section) {
      setSelectedEnrollCode(section.section.enrollCode);
    } else {
      setSelectedEnrollCode(section.cells[9].value);
    }
    handleShow();
  };

  const saveCallback = () => {
    const psId = {
      psId: localStorage["ModalForm-psId"],
    };
    const dataFinal = { psId, enrollCd: selectedEnrollCode };
    mutation.mutate(dataFinal);
  };

  // Stryker restore all
  // Stryker disable BooleanLiteral
  const columns = [
    {
      Header: "Quarter",
      accessor: (row) => yyyyqToQyy(row.courseInfo.quarter),
      disableGroupBy: true,
      id: "quarter",

      aggregate: getFirstVal,
      Aggregated: ({ cell: { value } }) => `${value}`,
    },
    {
      Header: "Course ID",
      accessor: "courseInfo.courseId",

      Cell: ({ cell: { value } }) => value.substring(0, value.length - 2),
    },
    {
      Header: "Title",
      accessor: "courseInfo.title",
      disableGroupBy: true,

      aggregate: getFirstVal,
      Aggregated: ({ cell: { value } }) => `${value}`,
    },
    {
      // Stryker disable next-line StringLiteral: this column is hidden, very hard to test
      Header: "Is Section?",
      accessor: (row) => isSection(row.section.section),
      // Stryker disable next-line StringLiteral: this column is hidden, very hard to test
      id: "isSection",
    },
    {
      Header: "Status",
      accessor: (row) => formatStatus(row.section),
      disableGroupBy: true,
      id: "status",

      aggregate: getFirstVal,
      Aggregated: ({ cell: { value } }) => `${value}`,
    },
    {
      Header: "Enrolled",
      accessor: (row) =>
        convertToFraction(row.section.enrolledTotal, row.section.maxEnroll),
      disableGroupBy: true,
      id: "enrolled",

      aggregate: getFirstVal,
      Aggregated: ({ cell: { value } }) => `${value}`,
    },
    {
      Header: "Location",
      accessor: (row) => formatLocation(row.section.timeLocations),
      disableGroupBy: true,
      id: "location",

      aggregate: getFirstVal,
      Aggregated: ({ cell: { value } }) => `${value}`,
    },
    {
      Header: "Days",
      accessor: (row) => formatDays(row.section.timeLocations),
      disableGroupBy: true,
      id: "days",

      aggregate: getFirstVal,
      Aggregated: ({ cell: { value } }) => `${value}`,
    },
    {
      Header: "Time",
      accessor: (row) => formatTime(row.section.timeLocations),
      disableGroupBy: true,
      id: "time",

      aggregate: getFirstVal,
      Aggregated: ({ cell: { value } }) => `${value}`,
    },
    {
      Header: "Instructor",
      accessor: (row) => formatInstructors(row.section.instructors),
      disableGroupBy: true,
      id: "instructor",

      aggregate: getFirstVal,
      Aggregated: ({ cell: { value } }) => `${value}`,
    },
    {
      Header: "Enroll Code",
      accessor: "section.enrollCode",
      disableGroupBy: true,

      aggregate: getFirstVal,
      Aggregated: ({ cell: { value } }) => `${value}`,
    },
    {
      Header: "Info",
      accessor: formatInfoLink,
      Cell: renderInfoLink,
      disableGroupBy: true,
      id: "info",

      aggregate: getFirstVal,
      Aggregated: renderInfoLink,
    },
  ];

  const testid = "SectionsTable";

  const buttonColumns = [...columns];

  const columnsToDisplay = buttonColumns;

  return (
    <>
      <SectionsTableBase
        data={sections}
        columns={columnsToDisplay}
        testid={testid}
        addCallback={addCallback}
      />

      {/* Modal JSX */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Section to Schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Modal content here, such as a form to select a schedule and add a section */}
          <Form>
            <Form.Group className="mb-3" data-testid="ModalForm-enrollCd">
              <Form.Label>Enroll Code</Form.Label>
              <Form.Control
                type="text"
                value={selectedEnrollCode || ""}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3" data-testid="ModalForm-psId">
              <PersonalScheduleDropdown
                schedules={schedules}
                schedule={schedule}
                setSchedule={setSchedule}
                controlId={"ModalForm-psId"}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              // Implement the logic to add the section to a schedule here
              saveCallback();
              handleClose();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
