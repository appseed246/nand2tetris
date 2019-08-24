export class SymbolTable {
  // シンボルテーブルのハッシュテーブル
  private definedSymbolTable: { [k: string]: number } = {
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
  private readonly table: { [k: string]: number } = {
    ...this.definedSymbolTable
  };

  addEntry(symbol: string, address: number): void {
    this.table[symbol] = address;
  }

  contains(symbol: string): boolean {
    return Object.keys(this.table).includes(symbol);
  }

  getAddress(symbol: string): number {
    return this.table[symbol];
  }

  /**
   * print table content (for debug)
   */
  printTable() {
    console.log("------------- SymbolTable -------------");
    Object.entries(this.table).forEach(([symbol, address]) => {
      console.log(`symbol:${symbol}, address:${address}`);
    });
    console.log("------------- SymbolTable -------------");
  }
}
