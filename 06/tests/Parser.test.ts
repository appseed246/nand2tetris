import * as fs from "fs";
import { ReadStream } from "fs";
import { Parser } from "../src/Parser";
import { Readable } from "stream";

describe("Parser test", () => {
  beforeAll(() => {
    jest.spyOn(fs, "createReadStream").mockImplementation(() => {
      const stream = new Readable() as ReadStream;
      stream._read = () => {};
      return stream;
    });
  });
  describe("constructor", () => {
    test("Parserインスタンスの生成が可能", () => {
      const stream: ReadStream = fs.createReadStream("../file");
      const parser = new Parser(stream);
      expect(parser).not.toBe(null);
    });
  });
  describe("hasMoreCommand", () => {
    test("入力されたファイルにコマンドが存在する場合trueを返す", async () => {
      const stream = fs.createReadStream("../file");
      stream.push("1234123412341234");
      stream.push(null);

      const parser = new Parser(stream);
      expect(await parser.hasMoreCommand()).toBe(true);
    });
    test("入力されたファイルにコマンドが存在しない場合falseを返す", async () => {
      const stream = fs.createReadStream("../file");
      stream.push(null);

      const parser = new Parser(stream);
      expect(await parser.hasMoreCommand()).toBe(false);
    });
  });
});
