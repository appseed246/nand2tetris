import { FileStream } from "../../src/FileStream";

export class MockStream implements FileStream {
  private lineCount = 0;

  constructor(private readonly fileData: string[]) {}

  async readNextLine(): Promise<string> {
    const line = this.fileData[this.lineCount];
    // console.log(line);
    if (line == undefined) {
      throw new Error("nextline does not read.");
    }
    this.lineCount++;
    return line;
  }

  rewind() {
    this.lineCount = 0;
  }

  hasNextCommand(): boolean {
    return this.fileData.length > this.lineCount;
  }
}
