import { FileStream } from "./FileStream";

export class Parser {
  // private nextCommand: string | null = null;

  constructor(private readonly stream: FileStream) {}

  async hasMoreCommand(): Promise<boolean> {
    // 次のコマンドが存在するならばtrueを返す
    return this.stream.hasNextCommand();
  }
}
