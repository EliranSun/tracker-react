import { getSleepData } from "./sleepData";

const weekData = [
  { date: '2023-09-09', wokeUp: "7:00", wentToBed: "23:00" },
  { date: '2023-09-10', wokeUp: "7:32", wentToBed: "0:30" },
  { date: '2023-09-11', wokeUp: "8:00", wentToBed: "22:00" },
  { date: '2023-09-12', wokeUp: "7:01", wentToBed: "23:44" },
  { date: '2023-09-13', wokeUp: "7:42", wentToBed: "1:44" },
];

const dayData = [
  { date: '2023-09-09', wokeUp: "7:00", wentToBed: "23:00" },
];

describe('Sleep Data', () => {
  describe('Week view', () => {
    it('should return correct sleep data', () => {
      const result = getSleepData(weekData, false);

      expect(result).toHaveLength(9);

      expect(result[0]).toEqual({ x: '2023-09-09', y: ["0:00", "7:00"] });
      expect(result[1]).toEqual({ x: '2023-09-09', y: ["23:00", "23:59"] });
      expect(result[2]).toEqual({ x: '2023-09-10', y: ["0:00", "7:30"] });
      expect(result[3]).toEqual({ x: '2023-09-11', y: ["0:30", "8:00"] });
      expect(result[4]).toEqual({ x: '2023-09-11', y: ["22:00", "23:59"] });
      expect(result[5]).toEqual({ x: '2023-09-12', y: ["0:00", "7:00"] });
      expect(result[6]).toEqual({ x: '2023-09-12', y: ["23:30", "23:59"] });
      expect(result[7]).toEqual({ x: '2023-09-13', y: ["0:00", "7:30"] });
      expect(result[8]).toEqual({ x: '2023-09-14', y: ["1:30", ""] });
    });
  });

  describe('Day view', () => {
    xit('should return correct sleep data', () => {
      const result = getSleepData(dayData, true);

      expect(result).toHaveLength(4);

      expect(result[0]).toEqual({ x: ["0:00", "7:00"], y: 5 });
      expect(result[1]).toEqual({ x: ["23:00", "23:59"], y: 5 });
      expect(result[1]).toEqual({ x: ["23:00", "23:59"], y: 5 });
      expect(result[1]).toEqual({ x: ["23:00", "23:59"], y: 5 });
    });
  });
});