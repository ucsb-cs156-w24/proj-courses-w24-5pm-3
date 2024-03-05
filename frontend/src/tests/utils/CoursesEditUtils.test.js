import {
  onDeleteSuccess,
  cellToAxiosParamsDelete,
} from "main/utils/CoursesEditUtils";
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

describe("CoursesEditUtils", () => {
  describe("onDeleteSuccess", () => {
    test("It puts the message on console.log and in a toast", () => {
      // arrange
      const restoreConsole = mockConsole();

      // act
      onDeleteSuccess("abc");

      // assert
      expect(mockToast).toHaveBeenCalledWith("abc");
      expect(console.log).toHaveBeenCalled();
      const message = console.log.mock.calls[0][0];
      expect(message).toMatch("abc");

      restoreConsole();
    });
  });
  describe("cellToAxiosParamsDelete", () => {
    test("It returns the correct params", () => {
      // arrange
      const cell = { row: { values: { "classSections[0].enrollCode": 17 } } };
      const psId = 2;
      // act
      const result = cellToAxiosParamsDelete({ cell, psId });

      // assert
      expect(result).toEqual({
        url: "/api/courses/user/deleteByPsIdAndEnrollCd",
        method: "DELETE",
        params: { enrollCd: 17, psId: 2 },
      });
    });
  });
});
