import { getSleepData, getTotalSleepData } from "./sleepData";

const data = [
  { date: '2023-09-09', wokeUp: "7:00", wentToBed: "23:00" },
  { date: '2023-09-10', wokeUp: "7:32", wentToBed: "0:30" },
  { date: '2023-09-11', wokeUp: "8:00", wentToBed: "22:00" },
  { date: '2023-09-12', wokeUp: "7:01", wentToBed: "23:44" },
  { date: '2023-09-13', wokeUp: "7:42", wentToBed: "1:44" },
];

describe('Sleep Data', () => {
  it('should pass for empty data in day view', () => {
    const result = getSleepData([], "2023-09-10");
    expect(result).toHaveLength(0);
  });
  
  it('should pass for empty data in week view', () => {
    const result = getSleepData();
    expect(result).toHaveLength(0);
  });
  
  describe('Week view', () => {
    it('should return correct sleep data', () => {
      const result = getSleepData(data);
      
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
  
  const SLEEP_Y_AXIS = 10;
  describe('Day view', () => {
    it('should return correct sleep data', () => {
      const result = getSleepData(data, '2023-09-12');
      
      expect(result).toHaveLength(2);
      
      expect(result[0]).toEqual({ x: ["0:00", "7:00"], y: SLEEP_Y_AXIS });
      expect(result[1]).toEqual({ x: ["23:30", "23:59"], y: SLEEP_Y_AXIS });
    });
    
    it('should return correct sleep data for next day bed time', () => {
      const result = getSleepData(data, '2023-09-10');
      
      expect(result).toHaveLength(1);
      
      expect(result[0]).toEqual({ x: ["0:00", "7:30"], y: SLEEP_Y_AXIS });
    });
    
    it('should return correct sleep data for previous day bed time', () => {
      const result = getSleepData(data, '2023-09-11');
      
      expect(result).toHaveLength(2);
      
      expect(result[0]).toEqual({ x: ["0:30", "8:00"], y: SLEEP_Y_AXIS });
      expect(result[1]).toEqual({ x: ["22:00", "23:59"], y: SLEEP_Y_AXIS });
    });
  });
  
  describe('Total sleep data', () => {
    it('should return correct sleep data', () => {
      const result = getTotalSleepData(data);
      
      expect(result).toHaveLength(5);
      
      expect(result[0]).toEqual({ x: '2023-09-09', y: 9 });
      expect(result[1]).toEqual({ x: '2023-09-10', y: 7 });
      expect(result[2]).toEqual({ x: '2023-09-11', y: 9 });
      expect(result[3]).toEqual({ x: '2023-09-12', y: 8 });
      expect(result[4]).toEqual({ x: '2023-09-13', y: 0 });
    });
  })
});