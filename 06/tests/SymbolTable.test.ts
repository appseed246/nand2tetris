import { SymbolTable } from "../src/SymbolTable";

describe("addEntry", () => {
  test("テーブルに(symbol, address)のペアを追加する", () => {
    const table = new SymbolTable();
    table.addEntry("symbol", 0b0000000000000010);
  });
});
describe("contains", () => {
  test("追加したシンボルがテーブルに含まれている", () => {
    const table = new SymbolTable();
    table.addEntry("symbol", 0b0000000000000010);
    expect(table.contains("symbol")).toBe(true);
    expect(table.contains("notinclude")).toBe(false);
  });
});
describe("getAddress", () => {
  test("引数で渡したシンボルのアドレス値を取得する", () => {
    const table = new SymbolTable();
    table.addEntry("symbol", 0b0000000000000011);
    expect(table.getAddress("symbol")).toBe(0b0000000000000011);
    expect(table.getAddress("symbol2")).toBeUndefined();
  });

  const definedSymbolTable: { [k: string]: number } = {
    SP: 0,
    LCL: 1,
    ARG: 2,
    THIS: 3,
    THAT: 4,
    R0: 0,
    R1: 1,
    R2: 2,
    R3: 3,
    R4: 4,
    R5: 5,
    R6: 6,
    R7: 7,
    R8: 8,
    R9: 9,
    R10: 10,
    R11: 11,
    R12: 12,
    R13: 13,
    R14: 14,
    R15: 15,
    SCREEN: 16384,
    KBD: 24576
  };
  for (const [symbol, address] of Object.entries(definedSymbolTable)) {
    test(`symbol:${symbol}の時、アドレス値${address}を得る`, () => {
      const table = new SymbolTable();
      expect(table.getAddress(symbol)).toBe(address);
    });
  }
});
