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
      expect(parser.hasMoreCommand()).toBe(true);
    });

    test("入力されたファイルにコマンドが存在しない場合falseを返す", async () => {
      const parser = getParser([]);
      expect(parser.hasMoreCommand()).toBe(false);
    });
  });
  describe("advance", () => {
    test("次のコマンドを読み込む", async () => {
      const parser = getParser(["1234123412341234\n"]);
      expect(parser.hasMoreCommand()).toBe(true);
      await parser.advance();
      expect(parser.hasMoreCommand()).toBe(false);
    });
    test("次のコマンドが存在しない場合に例外を投げる。", async () => {
      const parser = getParser([]);
      expect(parser.hasMoreCommand()).toBe(false);
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
    test("コマンド種別がL命令の時、シンボル文字列を返す", async () => {
      const parser = getParser(["    (symbol)\n"]);

      await parser.advance();
      expect(parser.commandType()).toBe("L_COMMAND");
      expect(parser.symbol()).toBe("symbol");
    });
  });
  describe("dest", () => {
    const expected: [string, string | null][] = [
      ["M=D+1\n", "M"],
      ["AD=M+1", "AD"],
      ["0;JMP // コメント", null],
      ["D=A // コメントを含む行", "D"],
      ["M=-1", "M"],
      ["M=!M", "M"]
    ];

    const parser = getParser(expected.map(([command, _]) => command));
    for (const [command, dest] of expected) {
      test(`command: ${command}の時、dest:${dest}を返す`, async () => {
        await parser.advance();
        expect(parser.commandType()).toBe("C_COMMAND");
        expect(parser.dest()).toBe(dest);
      });
    }
  });
  describe("comp", () => {
    const expected: [string, string | null][] = [
      ["0;JMP // コメント\n", "0"],
      ["M=M+1", "M+1"],
      ["D=A // コメントを含む", "A"],
      ["M=-1", "-1"],
      ["M=!M", "!M"]
    ];

    const parser = getParser(expected.map(([command, _]) => command));
    for (const [command, comp] of expected) {
      test(`command: ${command}の時、comp:${comp}を返す`, async () => {
        await parser.advance();
        expect(parser.commandType()).toBe("C_COMMAND");
        expect(parser.comp()).toBe(comp);
      });
    }
  });
  describe("jump", () => {
    const expected: [string, string | null][] = [
      ["0;JMP // コメント\n", "JMP"],
      ["M=M+1\n", null],
      ["D=A // コメントを含む行\n", null]
    ];

    const parser = getParser(expected.map(([command, _]) => command));
    for (const [command, jump] of expected) {
      test(`command: ${command}の時、jump:${jump}を返す`, async () => {
        await parser.advance();
        expect(parser.commandType()).toBe("C_COMMAND");
        expect(parser.jump()).toBe(jump);
      });
    }
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
