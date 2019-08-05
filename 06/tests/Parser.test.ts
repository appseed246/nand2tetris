import { Parser } from "../src/Parser";
import { MockStream } from "../tests/__mock__/MockStream";

const getParser = (streamContent: string[]): Parser => {
  const stream = new MockStream(streamContent);
  return new Parser(stream);
};

describe("Parser test", () => {
  describe("constructor", () => {
    test("Parserインスタンスの生成が可能", () => {
      const parser = getParser([
        "1234123412341234\n",
        "1234123412341234\n",
        "1234123412341234\n"
      ]);
      expect(parser).not.toBe(null);
    });
  });
  describe("hasMoreCommand", () => {
    test("入力されたファイルにコマンドが存在する場合trueを返す", async () => {
      const parser = getParser([
        "1234123412341234\n",
        "1234123412341234\n",
        "1234123412341234\n"
      ]);
      expect(await parser.hasMoreCommand()).toBe(true);
    });

    test("入力されたファイルにコマンドが存在しない場合falseを返す", async () => {
      const parser = getParser([]);
      expect(await parser.hasMoreCommand()).toBe(false);
    });
  });
  describe("advance", () => {
    test("次のコマンドを読み込む", async () => {
      const parser = getParser(["1234123412341234\n"]);
      expect(await parser.hasMoreCommand()).toBe(true);
      await parser.advance();
      expect(await parser.hasMoreCommand()).toBe(false);
    });
    test("次のコマンドが存在しない場合に例外を投げる。", async () => {
      const parser = getParser([]);
      expect(await parser.hasMoreCommand()).toBe(false);
      const promise = parser.advance();
      await expect(promise).rejects.toThrowError();
    });
  });
  describe("symbol", () => {
    test("コマンド種別がA命令の時、シンボル文字列を返す", async () => {
      const parser = getParser(["@symbol\n", "@10"]);

      await parser.advance();
      expect(parser.commandType()).toBe("A_COMMAND");
      expect(parser.symbol()).toBe("symbol");

      await parser.advance();
      expect(parser.commandType()).toBe("A_COMMAND");
      expect(parser.symbol()).toBe("10");
    });
  });
  describe("dest", () => {
    test("コマンド種別がC命令での時、destを返す", async () => {
      // prettier-ignore
      const parser = getParser([
            "M=D+1\n",
            "AD=M+1"
          ]);

      await parser.advance();
      expect(parser.commandType()).toBe("C_COMMAND");
      expect(parser.dest()).toBe("M");

      await parser.advance();
      expect(parser.commandType()).toBe("C_COMMAND");
      expect(parser.dest()).toBe("AD");
    });
  });
  describe("comp", () => {
    test("コマンド種別がC命令での時、compを返す", async () => {
      // prettier-ignore
      const parser = getParser([
        "0;JMP\n",
        "M=M+1\n",
        "@10"
      ]);

      await parser.advance();
      expect(parser.commandType()).toBe("C_COMMAND");
      expect(parser.comp()).toBe("0");

      await parser.advance();
      expect(parser.commandType()).toBe("C_COMMAND");
      expect(parser.comp()).toBe("M+1");

      await parser.advance();
      expect(parser.commandType()).toBe("A_COMMAND");
      expect(parser.comp()).toBe("");
    });
  });
  describe("jump", () => {
    test("コマンド種別がC命令での時、jumpを返す", async () => {
      // prettier-ignore
      const parser = getParser([
        "0;JMP\n"
      ]);

      await parser.advance();
      expect(parser.commandType()).toBe("C_COMMAND");
      expect(parser.jump()).toBe("JMP");
    });
  });
  describe("commandType", () => {
    test('ロードしたコマンドが「"A_COMMAND"」', async () => {
      // prettier-ignore
      const parser = getParser([
        "@1         \n",
        "         @10\n",
        "@abc\n",
        "..."
      ]);
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
      const parser = getParser([
        "(abc)\n",
        "    (end)\n",
        "()\n"
      ]);
      await parser.advance();
      expect(parser.commandType()).toBe("L_COMMAND");

      await parser.advance();
      expect(parser.commandType()).toBe("L_COMMAND");

      await parser.advance();
      expect(parser.commandType).toThrow();
    });
    test('ロードしたコマンドが「"C_COMMAND"」', async () => {
      // prettier-ignore
      const parser = getParser([
        "M=D+1        \n",
        "         0;JMP\n",
      ]);

      await parser.advance();
      expect(parser.commandType()).toBe("C_COMMAND");

      await parser.advance();
      expect(parser.commandType()).toBe("C_COMMAND");
    });
  });
});
