import { FileStream } from "./FileStream";
import { CommandType } from "./CommandType";

export class Parser {
  private nextCommand: string;

  constructor(private readonly stream: FileStream) {}

  hasMoreCommand(): boolean {
    // 次のコマンドが存在するならばtrueを返す
    return this.stream.hasNextCommand();
  }

  async advance(): Promise<void> {
    const command = await this.stream.readNextLine();
    const commandWithoutComment = command.split("//")[0];
    this.nextCommand = commandWithoutComment.trim();
    // console.log(this.nextCommand);
  }

  symbol(): string {
    // 先頭の「@」以降の文字列を返す
    if (this.nextCommand[0] === "@") {
      return this.nextCommand.slice(1);
    }
    if (this.nextCommand.match(/\(\w+\)/)) {
      return this.nextCommand.replace(/\((\w+)\)/g, "$1");
    }
    throw new Error(
      `invalid command: ${this.nextCommand}, type: ${this.commandType()} `
    );
  }

  dest(): string | null {
    // dest=compの場合
    if (this.nextCommand.includes("=")) {
      return this.nextCommand.split("=")[0];
    }
    // comp;jumpの場合
    return null;
  }

  comp(): string | null {
    // dest=compの場合
    if (this.nextCommand.includes("=")) {
      return this.nextCommand.split("=")[1];
    }
    // comp;jumpの場合
    if (this.nextCommand.includes(";")) {
      return this.nextCommand.split(";")[0];
    }
    return null;
  }

  jump(): string | null {
    // comp;jumpの場合
    if (this.nextCommand.includes(";")) {
      return this.nextCommand.split(";")[1];
    }
    // dest=compの場合
    return null;
  }

  commandType(): CommandType {
    const command = this.nextCommand;
    if (command.match(/^@/g)) {
      return "A_COMMAND";
    }
    if (command.match(/(^\w+\=[-!]*\w+)|(\w+\;\w+)/g)) {
      return "C_COMMAND";
    }
    if (command.match(/^\(\w+\)$/g)) {
      return "L_COMMAND";
    }
    return "UNKNOWN";
  }
}
