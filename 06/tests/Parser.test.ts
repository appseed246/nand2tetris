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
  describe("commandType", () => {
    test('ロードしたコマンドが「"A_COMMAND"」', async () => {
      // prettier-ignore
      const stream = new MockStream([
        "@1         \n",
        "         @10\n",
        "@abc\n",
        "..."
      ]);
      const parser = new Parser(stream);

      await parser.advance();
      expect(parser.commandType()).toBe("A_COMMAND");

      await parser.advance();
      expect(parser.commandType()).toBe("A_COMMAND");

      await parser.advance();
      expect(parser.commandType()).toBe("A_COMMAND");

      await parser.advance();
      expect(parser.commandType).toThrow();
    });
    test('ロードしたコマンドが「"L_COMMAND"」', async () => {
      // prettier-ignore
      const stream = new MockStream([
        "(abc)\n",
        "    (end)\n",
        "()\n"
      ]);
      const parser = new Parser(stream);

      await parser.advance();
      expect(parser.commandType()).toBe("L_COMMAND");

      await parser.advance();
      expect(parser.commandType()).toBe("L_COMMAND");

      await parser.advance();
      expect(parser.commandType).toThrow();
    });
    test('ロードしたコマンドが「"C_COMMAND"」', async () => {
      // prettier-ignore
      const stream = new MockStream([
        "M=D+1        \n",
        "         0;JMP\n",
      ]);
      const parser = new Parser(stream);

      await parser.advance();
      expect(parser.commandType()).toBe("C_COMMAND");

      await parser.advance();
      expect(parser.commandType()).toBe("C_COMMAND");
    });
  });
});
