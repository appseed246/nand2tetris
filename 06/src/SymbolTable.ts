export class SymbolTable {
  // シンボルテーブルのハッシュテーブル
  private readonly table: { [k: string]: number } = {};

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
