import { FileStream } from "./FileStream";
import { readFileSync } from "fs";
import * as path from "path";

export class Stream implements FileStream {
  readonly content: string[];
  constructor(filename: string) {
    const buffer = readFileSync(path.resolve(filename));
    this.content = buffer.toString().split("\n");
  }

  async readNextLine() {
    return this.content.shift()!;
  }
  hasNextCommand() {
    return this.content.length != 0;
  }
}
