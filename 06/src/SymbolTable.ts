export class SymbolTable {
  // シンボルテーブルのハッシュテーブル
  private readonly table: { [k: string]: number } = {};

  addEntry(symbol: string, address: number): void {
    this.table[symbol] = address;
  }

  contains(symbol: string): boolean {
    return Object.keys(this.table).includes(symbol);
  }

  getAddress(symbol: string): number | null {
    return this.table[symbol] || null;
  }
}
