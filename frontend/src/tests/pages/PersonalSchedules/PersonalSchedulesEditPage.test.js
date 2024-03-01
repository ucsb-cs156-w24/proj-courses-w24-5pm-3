import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import PersonalSchedulesEditPage from "main/pages/PersonalSchedules/PersonalSchedulesEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { personalSchedulesFixtures } from "fixtures/personalSchedulesFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useParams: () => ({
      id: 1,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("PersonalSchedulesEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/personalschedules?id=1").timeout();
      axiosMock.onGet("/api/personalSections/all?psId=1").timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <PersonalSchedulesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Personal Schedule");
      expect(
        screen.queryByTestId("PersonalSchedulesTable-header-id"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("PersonalSectionsEditTable-courseId"),
      ).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/personalschedules?id=1")
        .reply(200, personalSchedulesFixtures.onePersonalSchedule);
      axiosMock.onGet("/api/personalSections/all?psId=1").reply(200, [
        {
          courseId: "CMPSC 5A",
          classSections: [
            {
              enrollCode: "06881",
              section: "0100",
              enrolledTotal: 124,
              maxEnroll: 150,
              timeLocations: [
                {
                  room: "1004",
                  building: "GIRV",
                  roomCapacity: null,
                  days: " T R",
                  beginTime: "17:00",
                  endTime: "18:15",
                },
              ],
              instructors: [
                {
                  instructor: "GRIESSBAUM N",
                  functionCode: "Teaching and in charge",
                },
              ],
            },
          ],
          title: "INTRO DATA SCI 1",
          instructor: "GRIESSBAUM N",
        },
      ]);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <PersonalSchedulesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
    });

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <PersonalSchedulesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText("Edit Personal Schedule")).toBeInTheDocument();
      });
      await waitFor(() => {
        expect(
          screen.getByText("Sections in Personal Schedule"),
        ).toBeInTheDocument();
      });

      // Schedules Table

      await waitFor(() => {
        expect(
          screen.getByTestId("PersonalSchedulesTable-cell-row-0-col-id"),
        ).toHaveTextContent("1");
      });

      // Sections Table

      await waitFor(() => {
        expect(
          screen.getByTestId(
            "PersonalSectionsEditTable-cell-row-0-col-courseId",
          ),
        ).toHaveTextContent("CMPSC 5A");
      });
      expect(
        screen.getByTestId(
          `PersonalSectionsEditTable-cell-row-0-col-classSections[0].enrollCode`,
        ),
      ).toHaveTextContent("06881");
      expect(
        screen.getByTestId(
          `PersonalSectionsEditTable-cell-row-0-col-classSections[0].section`,
        ),
      ).toHaveTextContent("0100");
      expect(
        screen.getByTestId(`PersonalSectionsEditTable-cell-row-0-col-title`),
      ).toHaveTextContent("INTRO DATA SCI 1");
      expect(
        screen.getByTestId(`PersonalSectionsEditTable-cell-row-0-col-enrolled`),
      ).toHaveTextContent("124/150");
      expect(
        screen.getByTestId(`PersonalSectionsEditTable-cell-row-0-col-location`),
      ).toHaveTextContent("GIRV 1004");
      expect(
        screen.getByTestId(
          `PersonalSectionsEditTable-cell-row-0-col-classSections[0].timeLocations[0].days`,
        ),
      ).toHaveTextContent("T R");
      expect(
        screen.getByTestId(`PersonalSectionsEditTable-cell-row-0-col-time`),
      ).toHaveTextContent("5:00 PM - 6:15 PM");
      expect(
        screen.getByTestId(
          `PersonalSectionsEditTable-cell-row-0-col-instructor`,
        ),
      ).toHaveTextContent("GRIESSBAUM N");
      expect(
        screen.getByTestId(
          `PersonalSectionsEditTable-cell-row-0-col-Delete-button`,
        ),
      ).toHaveTextContent("Delete");
    });

    // FINISH FINAL FEW TESTS

    test("what happens when you click delete", async () => {
      axiosMock
        .onDelete("/api/courses/user/deleteByPsIdAndEnrollCd")
        .reply(200, "PSCourse with id 1 was deleted");
      const queryClient = new QueryClient();
      // act
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <PersonalSchedulesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      // assert
      await waitFor(() => {
        expect(
          screen.getByTestId(
            `PersonalSectionsEditTable-cell-row-0-col-courseId`,
          ),
        ).toBeInTheDocument();
      });

      expect(
        screen.getByTestId(`PersonalSectionsEditTable-cell-row-0-col-courseId`),
      ).toHaveTextContent("CMPSC 5A");

      const deleteButton = screen.getByTestId(
        `PersonalSectionsEditTable-cell-row-0-col-Delete-button`,
      );
      expect(deleteButton).toBeInTheDocument();

      // act
      fireEvent.click(deleteButton);

      // assert
      await waitFor(() => {
        expect(mockToast).toBeCalledWith("PSCourse with id 1 was deleted");
      });
    });
  });
});
