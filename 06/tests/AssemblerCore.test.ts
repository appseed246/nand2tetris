import { AssemblerCore } from "../src/AssemblerCore";
import { Parser } from "../src/Parser";
import { MockStream } from "./__mock__/MockStream";
import { MockWriter } from "./__mock__/MockWriter";

describe("constructor", () => {
  test("インスタンスを生成する", async () => {
    const parser = new Parser(new MockStream([]));
    const writer = new MockWriter();
    const assembler = new AssemblerCore(parser, writer);
    console.log(assembler);
  });
});
