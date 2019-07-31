import { FileStream } from "./FileStream";
import { CommandType } from "./CommandType";

export class Parser {
  private nextCommand: string;

  constructor(private readonly stream: FileStream) {}

  async hasMoreCommand(): Promise<boolean> {
    // 次のコマンドが存在するならばtrueを返す
    return this.stream.hasNextCommand();
  }

  async advance(): Promise<void> {
    const command = await this.stream.readNextLine();
    this.nextCommand = command.trim();
    // console.log(this.nextCommand);
  }

  symbol(): string {
    // 先頭の「@」以降の文字列を返す
    return this.nextCommand.slice(1);
  }

  commandType(): CommandType {
    const command = this.nextCommand;
    if (command.match(/^@/g)) {
      return "A_COMMAND";
    }
    if (command.match(/(^\w+\=\w+)|(\w+\;\w+)/g)) {
      return "C_COMMAND";
    }
    if (command.match(/^\(\w+\)$/g)) {
      return "L_COMMAND";
    }
    throw new Error("Illegal Command.");
  }
}
