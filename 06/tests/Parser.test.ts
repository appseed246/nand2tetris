import { Parser } from "../src/Parser";
import { MockStream } from "../tests/__mock__/MockStream";

describe("Parser test", () => {
  describe("constructor", () => {
    test("Parserインスタンスの生成が可能", () => {
      const stream = new MockStream([
        "1234123412341234\n",
        "1234123412341234\n",
        "1234123412341234\n"
      ]);
      const parser = new Parser(stream);
      expect(parser).not.toBe(null);
    });
  });
  describe("hasMoreCommand", () => {
    test("入力されたファイルにコマンドが存在する場合trueを返す", async () => {
      const stream = new MockStream([
        "1234123412341234\n",
        "1234123412341234\n",
        "1234123412341234\n"
      ]);

      const parser = new Parser(stream);
      expect(await parser.hasMoreCommand()).toBe(true);
    });

    test("入力されたファイルにコマンドが存在しない場合falseを返す", async () => {
      const stream = new MockStream([]);
      const parser = new Parser(stream);
      expect(await parser.hasMoreCommand()).toBe(false);
    });
  });
  describe("advance", () => {
    test("次のコマンドを読み込む", async () => {
      const stream = new MockStream(["1234123412341234\n"]);
      const parser = new Parser(stream);
      expect(await parser.hasMoreCommand()).toBe(true);
      await parser.advance();
      expect(await parser.hasMoreCommand()).toBe(false);
    });
    test("次のコマンドが存在しない場合に例外を投げる。", async () => {
      const stream = new MockStream([]);
      const parser = new Parser(stream);
      expect(await parser.hasMoreCommand()).toBe(false);
      const promise = parser.advance();
      await expect(promise).rejects.toThrowError();
    });
  });
});
