import { Parser } from "./Parser";
import { Stream } from "./Stream";
import { Code } from "./Code";
import { existsSync } from "fs";
import { SymbolTable } from "./SymbolTable";

/**
 * @usage ts-node Assembler.ts <*.asm>
 */
export class Assembler {
  private readonly symbolTable: SymbolTable = new SymbolTable();
  private ramAddress = 0x0010;

  async assemble(filename: string) {
    // シンボルテーブルの紐付け
    const parser = new Parser(new Stream(filename));
    await this.initSymbolTable(parser);
    // this.symbolTable.printTable();

    // バイナリコマンド生成
    const parser2 = new Parser(new Stream(filename));
    while (parser2.hasMoreCommand()) {
      await parser2.advance();
      switch (parser2.commandType()) {
        case "A_COMMAND":
          this.printACommand(parser2);
          break;
        case "C_COMMAND":
          this.printCCommand(parser2);
          break;
        case "L_COMMAND":
          this.printLCommand(parser2);
          break;
        default:
          // 無効なコマンドを無視する
          break;
      }
    }
  }

  private async initSymbolTable(parser: Parser): Promise<void> {
    let romAddress: number = 0;
    while (await parser.hasMoreCommand()) {
      await parser.advance();
      if (
        parser.commandType() === "C_COMMAND" ||
        parser.commandType() === "A_COMMAND"
      ) {
        romAddress++;
      } else if (parser.commandType() === "L_COMMAND") {
        // シンボルの次の行のアドレスと紐付ける
        this.symbolTable.addEntry(parser.symbol(), romAddress + 1);
      }
    }
  }

  private printACommand(parser: Parser): void {
    const symbol = parser.symbol();
    let address: number;
    // シンボルが10進数文字列ならばシンボルの値をそのまま使用する
    if (this.isDecimal(symbol)) {
      address = Number(symbol);
    } else if (this.symbolTable.contains(symbol)) {
      address = this.symbolTable.getAddress(symbol);
    } else {
      this.symbolTable.addEntry(symbol, this.ramAddress);
      address = this.ramAddress;
      this.ramAddress++;
    }
    this.writeOut(this.zeroPadding(String(address), 16));
  }

  private printCCommand(parser: Parser): void {
    const dest = Code.dest(parser.dest());
    const comp = Code.comp(parser.comp());
    const jump = Code.jump(parser.jump());
    this.writeOut(`111${comp}${dest}${jump}`);
  }

  private printLCommand(_parser: Parser): void {
    // const label = parser.symbol();
  }

  /**
   * 引数で受けた文字列を出力する
   * @param binary バイナリ命令文字列
   */
  private writeOut(binary: string) {
    console.log(binary);
  }

  /**
   * 数値nをlengthで指定した長さになるように0埋めした文字列を返す
   * @param n 数値
   * @param length ゼロ埋めした場合の文字列長
   */
  private zeroPadding(n: string, length: number) {
    return length + 1 - n.length > 0
      ? Array(length + 1 - n.length).join("0") + n
      : n;
  }

  /**
   * 引数で受けた文字列が10進数であればtrue
   * @param n 10進数判定対象文字列
   */
  private isDecimal(n: string) {
    return n.match(/^[1-9][0-9]+$|^0$/g);
  }
}

(async () => {
  // ファイル名指定なし
  if (process.argv.length < 3) {
    console.log("Error: few args.");
    console.log("usage: ts-node Assembler.ts <xxx.asm>");
    return;
  }
  const filename: string = process.argv[2];
  // .asmファイル以外を指定
  if (!filename.match(/\.asm$/g)) {
    console.log('Error: filename is not "*.asm"');
    return;
  }
  if (!existsSync(filename)) {
    console.log(`Error: file does not exists: ${filename}`);
    return;
  }
  const assembler = new Assembler();
  await assembler.assemble(filename);
})();
