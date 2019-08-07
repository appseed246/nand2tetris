import { Parser } from "./Parser";
import { Stream } from "./Stream";
import { Code } from "./Code";

const stream = new Stream("../test.asm");
const parser = new Parser(stream);

const main = async () => {
  while (await parser.hasMoreCommand()) {
    await parser.advance();
    switch (parser.commandType()) {
      case "A_COMMAND":
        printACommand();
        break;
      case "C_COMMAND":
        printCCommand();
        break;
      case "L_COMMAND":
        printLCommand();
        break;
      default:
        throw new Error("Invalid Command Type");
    }
  }
};

const printACommand = () => {
  const symbol = parser.symbol();
  console.log(zeroPadding(symbol, 16));
};

const printCCommand = () => {
  const dest = Code.dest(parser.dest());
  const comp = Code.comp(parser.comp());
  const jump = Code.jump(parser.jump());
  console.log(`111${comp}${dest}${jump}`);
};

const printLCommand = () => {
  // const label = parser.symbol();
};

/**
 * 数値nをlengthで指定した長さになるように0埋めした文字列を返す
 * @param n 数値
 * @param length ゼロ埋めした場合の文字列長
 */
const zeroPadding = (n: string, length: number) => {
  return length + 1 - n.length > 0
    ? Array(length + 1 - n.length).join("0") + n
    : n;
};

main();
