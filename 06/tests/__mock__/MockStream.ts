import { FileStream } from "../../src/FileStream";

export class MockStream implements FileStream {
  constructor(private readonly fileData: string[]) {}

  async readNextLine(): Promise<string | null> {
    return this.fileData.pop() || null;
  }

  hasNextCommand(): boolean {
    return this.fileData.length != 0;
  }
}
