import { Parser } from "../src/Parser";
import { MockStream } from "./__mock__/MockStream";
import { CommandType } from "../src/CommandType";

describe("CommandType", () => {
  const seeds: [string, CommandType][] = [
    ["eq", "C_ARITHMETIC"],
    ["lt", "C_ARITHMETIC"],
    ["gt", "C_ARITHMETIC"],
    ["add", "C_ARITHMETIC"],
    ["sub", "C_ARITHMETIC"],
    ["neg", "C_ARITHMETIC"],
    ["and", "C_ARITHMETIC"],
    ["or", "C_ARITHMETIC"],
    ["not", "C_ARITHMETIC"]
  ];
  for (const [command, desire] of seeds) {
    test(`Commandが"${command}"の時、"${desire}"を返す`, async () => {
      const parser = new Parser(new MockStream([command]));
      await parser.advance();
      expect(parser.commandType()).toBe(desire);
    });
  }
});
