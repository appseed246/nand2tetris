import { FileStream } from "./FileStream";
import { readFileSync } from "fs";
import * as path from "path";

export class Stream implements FileStream {
  private readonly content: string[];
  private lineCount = 0;

  constructor(filename: string) {
    const buffer = readFileSync(path.resolve(filename));
    this.content = buffer.toString().split("\n");
  }

  async readNextLine() {
    const nextLine = this.content[this.lineCount];
    this.lineCount++;
    return nextLine;
  }

  rewind() {
    this.lineCount = 0;
  }

  hasNextCommand() {
    return this.content.length > this.lineCount;
  }
}
