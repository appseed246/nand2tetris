import { ReadStream } from "fs";
import * as readline from "readline";

export class Parser {
  private readonly readline: readline.Interface;
  private nextCommand: string | null = null;

  constructor(stream: ReadStream) {
    this.readline = readline.createInterface({ input: stream });
  }

  async hasMoreCommand(): Promise<boolean> {
    return new Promise(resolve => {
      // コマンドが取得できた場合trueを返す
      this.readline.on("line", (input: string) => {
        this.nextCommand = input;
        console.log(this.nextCommand);
        resolve(true);
      });
      // コマンドがない場合falseを返す
      this.readline.on("close", () => {
        resolve(false);
      });
    });
  }
}
