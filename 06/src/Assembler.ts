import { Parser } from "./Parser";
import { Stream } from "./Stream";
import { Code } from "./Code";
import { existsSync } from "fs";

/**
 * @usage ts-node Assembler.ts <*.asm>
 */
export class Assembler {
  static async assemble(filename: string) {
    const stream = new Stream(filename);
    const parser = new Parser(stream);

    while (await parser.hasMoreCommand()) {
      await parser.advance();
      switch (parser.commandType()) {
        case "A_COMMAND":
          this.printACommand(parser);
          break;
        case "C_COMMAND":
          this.printCCommand(parser);
          break;
        case "L_COMMAND":
          this.printLCommand(parser);
          break;
        default:
          throw new Error("Invalid Command Type");
      }
    }
  }

  private static printACommand(parser: Parser) {
    const symbol = parser.symbol();
    this.writeOut(this.zeroPadding(symbol, 16));
  }

  private static printCCommand(parser: Parser) {
    const dest = Code.dest(parser.dest());
    const comp = Code.comp(parser.comp());
    const jump = Code.jump(parser.jump());
    this.writeOut(`111${comp}${dest}${jump}`);
  }

  private static printLCommand(_parser: Parser) {
    // const label = parser.symbol();
  }

  /**
   * 引数で受けた文字列を出力する
   * @param binary バイナリ命令文字列
   */
  private static writeOut(binary: string) {
    console.log(binary);
  }

  /**
   * 数値nをlengthで指定した長さになるように0埋めした文字列を返す
   * @param n 数値
   * @param length ゼロ埋めした場合の文字列長
   */
  private static zeroPadding(n: string, length: number) {
    return length + 1 - n.length > 0
      ? Array(length + 1 - n.length).join("0") + n
      : n;
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
  await Assembler.assemble(filename);
})();
