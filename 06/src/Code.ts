export class Code {
  static dest(symbol: string | null): string {
    // prettier-ignore
    const seeds: [string|null, string][] = [
      [null, "000"],
      ["M", "001"],
      ["D", "010"],
      ["MD", "011"],
      ["A", "100"],
      ["AM", "101"],
      ["AD", "110"],
      ["AMD", "111"]
    ];
    const elm = seeds.find(([sym, _]) => {
      return sym == symbol;
    });
    if (elm == null) {
      throw new Error(`Illegal Symbol: ${symbol}`);
    }
    return elm[1];
  }
}
