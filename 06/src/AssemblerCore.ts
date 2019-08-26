import { Parser } from "./Parser";
import { Code } from "./Code";
import { SymbolTable } from "./SymbolTable";
import { Writer } from "./Writer";

export class AssemblerCore {
  private readonly symbolTable: SymbolTable = new SymbolTable();
  private ramAddress = 0x0010;

  constructor(private parser: Parser, private writer: Writer) {}

  async assemble() {
    // シンボルテーブルの紐付け
    await this.initSymbolTable(this.parser);

    // ファイルを先頭まで巻き戻す
    this.parser.rewind();
    // バイナリコマンド生成
    while (this.parser.hasMoreCommand()) {
      await this.parser.advance();
      // console.log(`type: ${this.parser.commandType()}`);
      switch (this.parser.commandType()) {
        case "A_COMMAND":
          this.printACommand(this.parser);
          break;
        case "C_COMMAND":
          this.printCCommand(this.parser);
          break;
        case "L_COMMAND":
          // nop
          break;
        default:
          // 無効なコマンドを無視する
          break;
      }
    }
  }

  private async initSymbolTable(parser: Parser): Promise<void> {
    let romAddress: number = -1;
    while (await parser.hasMoreCommand()) {
      await parser.advance();
      if (
        parser.commandType() === "C_COMMAND" ||
        parser.commandType() === "A_COMMAND"
      ) {
        romAddress++;
      } else if (parser.commandType() === "L_COMMAND") {
        // シンボルの次の行のアドレスと紐付ける
        // console.log(`symbol: ${parser.symbol()}, address:${romAddress + 1}`);
        this.symbolTable.addEntry(parser.symbol(), romAddress + 1);
      }
    }
  }

  private printACommand(parser: Parser): void {
    const symbol = parser.symbol();
    // console.log(`symbol: ${symbol}`);
    let address: string;
    const toBinary = (n: string) => parseInt(n, 10).toString(2);
    // シンボルが10進数文字列ならばシンボルの値をそのまま使用する
    if (this.isDecimal(symbol)) {
      address = toBinary(symbol);
      // console.log(address);
    } else if (this.symbolTable.contains(symbol)) {
      const rawAddress = this.symbolTable.getAddress(symbol);
      address = toBinary(rawAddress.toString(10));
    } else {
      this.symbolTable.addEntry(symbol, this.ramAddress);
      address = toBinary(this.ramAddress.toString(10));
      this.ramAddress++;
    }
    this.writeOut(this.zeroPadding(address, 16));
  }

  private printCCommand(parser: Parser): void {
    const dest = Code.dest(parser.dest());
    const comp = Code.comp(parser.comp());
    const jump = Code.jump(parser.jump());
    this.writeOut(`111${comp}${dest}${jump}`);
  }

  /**
   * 引数で受けた文字列を出力する
   * @param binary バイナリ命令文字列
   */
  private writeOut(binary: string): void {
    this.writer.writeOut(binary + "\n");
  }

  /**
   * 数値nをlengthで指定した長さになるように0埋めした文字列を返す
   * @param n 数値
   * @param length ゼロ埋めした場合の文字列長
   */
  private zeroPadding(n: string, length: number): string {
    return length + 1 - n.length > 0
      ? Array(length + 1 - n.length).join("0") + n
      : n;
  }

  /**
   * 引数で受けた文字列が10進数であればtrue
   * @param n 10進数判定対象文字列
   */
  private isDecimal(n: string): boolean {
    return n.match(/^[1-9]*[0-9]+$|^0$/g) != null;
  }
}
