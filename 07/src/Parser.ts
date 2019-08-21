import { FileStream } from "./FileStream";
import { CommandType } from "./CommandType";

export class Parser {
  private nextCommand: string;
  // CommandType: C_ARITHMETIC
  private readonly arithmeticCommands: string[] = [
    "eq",
    "lt",
    "gt",
    "add",
    "sub",
    "neg",
    "and",
    "or",
    "not"
  ];

  constructor(private stream: FileStream) {}

  public hasMoreCommand() {
    // 次のコマンドが存在するならばtrueを返す
    return this.stream.hasNextCommand();
  }

  public async advance() {
    const command = await this.stream.readNextLine();
    this.nextCommand = command.trim();
    console.log(this.nextCommand);
  }

  public commandType(): CommandType {
    if (this.arithmeticCommands.includes(this.nextCommand)) {
      return "C_ARITHMETIC";
    }
    throw new Error("invalid command type");
  }
}
