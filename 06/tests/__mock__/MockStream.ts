import { FileStream } from "../../src/FileStream";

export class MockStream implements FileStream {
  constructor(private readonly fileData: string[]) {}

  async readNextLine(): Promise<string> {
    const line = this.fileData.shift();
    // console.log(line);
    if (line == undefined) {
      throw new Error("nextline does not read.");
    }
    return line;
  }

  hasNextCommand(): boolean {
    return this.fileData.length != 0;
  }
}
