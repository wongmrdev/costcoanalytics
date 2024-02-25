import * as utils from "../models/utils";

// a test for the utils file
describe("utils", () => {
  describe("addStartDate", () => {
    it("should add a start date to an array of objects", () => {
      const data = [
        {
          dateValid: "Valid 1/1/21 - 2/12/21",
          price: 1.99,
        },
        {
          dateValid: "Valid 2/10/21 - 2/28/21",
          price: 1.99,
        },
        {
          dateValid: "Valid 10/1/22 - 1/12/22",
          price: 1.99,
        },
      ];
      const result = data.map(utils.addStartDate);
      expect(result[0].startDate).toEqual(new Date("2021-01-01T10:00:00.000Z"));
      expect(result[1].startDate).toEqual(new Date("2021-02-10T10:00:00.000Z"));
      expect(result[2].startDate).toEqual(new Date("2022-10-01T09:00:00.000Z"));
    });
  });
});
