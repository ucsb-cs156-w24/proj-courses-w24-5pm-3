import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  fiveSections,
  gigaSections,
  oneLectureSectionWithNoDiscussion,
} from "fixtures/sectionFixtures";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import SectionsTable from "main/components/Sections/SectionsTable";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

describe("Section tests", () => {
  const queryClient = new QueryClient();
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    axiosMock.reset();
    localStorage.clear();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  test("renders without crashing for empty table", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={[]} />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  test("Has the expected cell values when expanded", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={fiveSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedHeaders = [
      "Quarter",
      "Course ID",
      "Title",
      "Status",
      "Enrolled",
      "Location",
      "Days",
      "Time",
      "Instructor",
      "Enroll Code",
      "Info",
    ];
    const expectedFields = [
      "quarter",
      "courseInfo.courseId",
      "courseInfo.title",
      "status",
      "enrolled",
      "location",
      "days",
      "time",
      "instructor",
      "section.enrollCode",
      "info",
    ];
    const testId = "SectionsTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    const expandRow = screen.getByTestId(
      `${testId}-cell-row-1-col-courseInfo.courseId-expand-symbols`,
    );
    fireEvent.click(expandRow);

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-quarter`),
    ).toHaveTextContent("W22");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-time`),
    ).toHaveTextContent("3:00 PM - 3:50 PM");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-days`),
    ).toHaveTextContent("M");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-status`),
    ).toHaveTextContent("Open");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-enrolled`),
    ).toHaveTextContent("84/100");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-location`),
    ).toHaveTextContent("HFH 1124");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-instructor`),
    ).toHaveTextContent("YUNG A S");
  });

  test("Has the expected column headers and content", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={fiveSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedHeaders = [
      "Quarter",
      "Course ID",
      "Title",
      "Status",
      "Enrolled",
      "Location",
      "Days",
      "Time",
      "Instructor",
      "Enroll Code",
      "Add Section",
    ];
    const expectedFields = [
      "quarter",
      "courseInfo.courseId",
      "courseInfo.title",
      "status",
      "enrolled",
      "location",
      "days",
      "time",
      "instructor",
      "section.enrollCode",
    ];
    const testId = "SectionsTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-courseInfo.courseId`),
    ).toHaveTextContent("ECE 1A");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-courseInfo.title`),
    ).toHaveTextContent("COMP ENGR SEMINAR");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-quarter`),
    ).toHaveTextContent("W22");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-time`),
    ).toHaveTextContent("3:00 PM - 3:50 PM");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-days`),
    ).toHaveTextContent("M");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-status`),
    ).toHaveTextContent("Open");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-enrolled`),
    ).toHaveTextContent("84/100");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-location`),
    ).toHaveTextContent("BUCHN 1930");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-instructor`),
    ).toHaveTextContent("WANG L C");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-section.enrollCode`),
    ).toHaveTextContent("12583");

    const expandRow = screen.getByTestId(
      `${testId}-cell-row-1-col-courseInfo.courseId-expand-symbols`,
    );
    fireEvent.click(expandRow);
    fireEvent.click(screen.getAllByText("Add")[1]);

    expect(
      screen.getByTestId("ModalForm-enrollCd").querySelector("input"),
    ).toHaveValue("12609");
  });

  test("Correctly groups separate lectures of the same class", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={gigaSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const testId = "SectionsTable";

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-courseInfo.courseId`),
    ).toHaveTextContent("➕ MATH 3B");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-courseInfo.courseId`),
    ).toHaveTextContent("➕ MATH 3B");

    const expandRow = screen.getByTestId(
      `${testId}-cell-row-1-col-courseInfo.courseId-expand-symbols`,
    );
    fireEvent.click(expandRow);

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-courseInfo.courseId`),
    ).toHaveTextContent("➖ MATH 3B");
  });

  test("First dropdown is different than last dropdown", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={fiveSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const testId = "SectionsTable";

    const expandRow = screen.getByTestId(
      `${testId}-cell-row-1-col-courseInfo.courseId-expand-symbols`,
    );
    fireEvent.click(expandRow);

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-enrolled`),
    ).toHaveTextContent("84/80");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-enrolled`),
    ).toHaveTextContent("21/21");
  });

  test("Status utility identifies each type of status", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={fiveSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const testId = "SectionsTable";

    const expandRow = screen.getByTestId(
      `${testId}-cell-row-1-col-courseInfo.courseId-expand-symbols`,
    );
    fireEvent.click(expandRow);

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-status`),
    ).toHaveTextContent("Closed");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-status`),
    ).toHaveTextContent("Full");
    expect(
      screen.getByTestId(`${testId}-cell-row-3-col-status`),
    ).toHaveTextContent("Cancelled");
    expect(
      screen.getByTestId(`${testId}-cell-row-4-col-status`),
    ).toHaveTextContent("Open");
  });

  test("Info link is correct", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={fiveSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const testId = "SectionsTable";

    const expandRow = screen.getByTestId(
      `${testId}-cell-row-1-col-courseInfo.courseId-expand-symbols`,
    );
    fireEvent.click(expandRow);

    expect(
      screen
        .getByTestId(`${testId}-cell-row-1-col-info`)
        .querySelector('a[href$="/coursedetails/20221/12591"]'),
    ).toBeInTheDocument();
    expect(
      screen
        .getByTestId(`${testId}-cell-row-2-col-info`)
        .querySelector('a[href$="/coursedetails/20221/12609"]'),
    ).toBeInTheDocument();
    expect(
      screen
        .getByTestId(`${testId}-cell-row-3-col-info`)
        .querySelector('a[href$="/coursedetails/20221/12617"]'),
    ).toBeInTheDocument();
    expect(
      screen
        .getByTestId(`${testId}-cell-row-4-col-info`)
        .querySelector('a[href$="/coursedetails/20221/12625"]'),
    ).toBeInTheDocument();
  });

  test("Modal displays on add button click", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={fiveSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const testId = "SectionsTable";

    const expandRow = screen.getByTestId(
      `${testId}-cell-row-1-col-courseInfo.courseId-expand-symbols`,
    );
    fireEvent.click(expandRow);

    const addButton = screen.getAllByText("Add")[1]; // Get the first add button
    fireEvent.click(addButton);

    const modalTitle = screen.getByText("Add Section to Schedule");
    expect(modalTitle).toBeInTheDocument();

    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByText("Add Section to Schedule"),
      ).not.toBeInTheDocument();
    });
  });

  test("when you fill in the form and hit submit, it makes a request to the backend (with sections)", async () => {
    const courses = [
      {
        id: "17",
        psId: 13,
        enrollCd: "08250",
      },
    ];

    axiosMock.onPost("/api/courses/post").reply(202, courses);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={fiveSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const testId = "SectionsTable";

    const expandRow = screen.getByTestId(
      `${testId}-cell-row-1-col-courseInfo.courseId-expand-symbols`,
    );
    fireEvent.click(expandRow);

    const addButton = screen.getAllByText("Add")[1]; // Get the first add button
    fireEvent.click(addButton);

    expect(await screen.findByTestId("ModalForm-enrollCd")).toBeInTheDocument();

    const psIdField = document.querySelector("#ModalForm-psId");
    const submitButton = screen.getByText("Save Changes");

    fireEvent.change(psIdField, { target: { value: "13" } });
    localStorage.setItem("ModalForm-psId", "13");

    expect(submitButton).toBeInTheDocument();
    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));
    expect(localStorage.getItem("ModalForm-psId")).toBe("13");
    expect(axiosMock.history.post[0].params).toEqual({
      psId: "13",
      enrollCd: "12609",
    });

    expect(mockToast).toBeCalledWith(
      "New course Created - id: 17 enrollCd: 08250",
    );
  });

  test("when you fill in the form and hit submit, it makes a request to the backend (no sections)", async () => {
    const courses = [
      {
        id: "17",
        psId: 13,
        enrollCd: "08250",
      },
    ];

    axiosMock.onPost("/api/courses/post").reply(202, courses);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={oneLectureSectionWithNoDiscussion} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const addButton = screen.getAllByText("Add")[0]; // Get the first add button
    fireEvent.click(addButton);

    expect(await screen.findByTestId("ModalForm-enrollCd")).toBeInTheDocument();

    const psIdField = document.querySelector("#ModalForm-psId");
    const submitButton = screen.getByText("Save Changes");

    fireEvent.change(psIdField, { target: { value: "13" } });
    localStorage.setItem("ModalForm-psId", "13");

    expect(submitButton).toBeInTheDocument();
    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));
    expect(localStorage.getItem("ModalForm-psId")).toBe("13");
    expect(axiosMock.history.post[0].params).toEqual({
      psId: "13",
      enrollCd: "31781",
    });

    expect(mockToast).toBeCalledWith(
      "New course Created - id: 17 enrollCd: 08250",
    );
  });

  test("sets schedule and updates localStorage when schedules are available", async () => {
    axiosMock.onGet("/api/personalschedules/all").reply(200, [
      {
        id: 17,
        name: "SampName",
        description: "desc",
        quarter: "W22",
      },
    ]);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SectionsTable sections={fiveSections} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const testId = "SectionsTable";

    const expandRow = screen.getByTestId(
      `${testId}-cell-row-1-col-courseInfo.courseId-expand-symbols`,
    );
    fireEvent.click(expandRow);

    const addButton = screen.getAllByText("Add")[1]; // Get the first add button
    fireEvent.click(addButton);

    expect(await screen.findByTestId("ModalForm-enrollCd")).toBeInTheDocument();
    const saveChangesButton = screen.getByText("Save Changes");
    fireEvent.click(saveChangesButton);
    await waitFor(
      () => {
        expect(localStorage.getItem("ModalForm-psId")).toBe("17");
      },
      { timeout: 5000 },
    );
  });
});
