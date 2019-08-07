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
    expect(table.getAddress("symbol2")).toBe(null);
  });
});
