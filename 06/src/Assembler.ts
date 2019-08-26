import { existsSync } from "fs";
import { AssemblerCore } from "./AssemblerCore";
import { Parser } from "./Parser";
import { FileStream } from "./FileStream";
import { FileWriter } from "./FileWriter";

/**
 * アセンブラプログラムのエントリポイント
 * @usage ts-node Assembler.ts <*.asm>
 */
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

  const parser = new Parser(new FileStream(filename));
  const writer = new FileWriter(filename.replace(".asm", ".hack"));
  const assembler = new AssemblerCore(parser, writer);

  await assembler.assemble();
})();
