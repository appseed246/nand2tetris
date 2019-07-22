import { FileStream } from "./FileStream";

export class Parser {
  private nextCommand: string | null = null;

  constructor(private readonly stream: FileStream) {}

  async hasMoreCommand(): Promise<boolean> {
    // 次の行の文字列を習得する
    this.nextCommand = await this.stream.readNextLine();
    // 次のコマンドが存在するならばtrueを返す
    return this.nextCommand != null;
  }
}
