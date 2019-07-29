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
    this.nextCommand = await this.stream.readNextLine();
    console.log(this.nextCommand);
  }

  commandType(): CommandType {
    const command = this.nextCommand.trim();
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
