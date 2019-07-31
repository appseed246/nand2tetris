import { Code } from "../src/Code";

describe("dest", () => {
  test("バイナリ文字列を返す", () => {
    // prettier-ignore
    const seeds: [string | null, string][] = [
      [null, "000"],
      ["M", "001"],
      ["D", "010"],
      ["MD", "011"],
      ["A", "100"],
      ["AM", "101"],
      ["AD", "110"],
      ["AMD", "111"]
    ];
    seeds.forEach(([symbol, bin]) => {
      expect(Code.dest(symbol)).toBe(bin);
    });
  });
});
