import React from "react";
import { useBackend } from "main/utils/useBackend";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import PersonalSchedulesTable from "main/components/PersonalSchedules/PersonalSchedulesTable";
import { useCurrentUser } from "main/utils/currentUser";

import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function PersonalSchedulesIndexPage() {
  const currentUser = useCurrentUser();

  const {
    data: personalSchedules,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/personalschedules/all"],
    { method: "GET", url: "/api/personalschedules/all" },
    [],
  );

  const navigate = useNavigate();
  const addScheduleCallback = () => {
    navigate(`/personalschedules/create`);
  };
  const addCourseCallback = () => {
    navigate(`/courses/create`);
  };

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Personal Schedules</h1>
        <PersonalSchedulesTable
          personalSchedules={personalSchedules}
          currentUser={currentUser}
        />

        <Button
          onClick={addScheduleCallback}
          data-testid="personalschedulespage-addschedule-button"
        >
          Add New Schedule
        </Button>
        <span> </span>
        <Button
          onClick={addCourseCallback}
          data-testid="personalschedulespage-addcourse-button"
        >
          Add New Course
        </Button>
      </div>
    </BasicLayout>
  );
}
