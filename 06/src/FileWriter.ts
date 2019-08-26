import { Writer } from "./Writer";
import { appendFileSync, existsSync, unlinkSync } from "fs";

export class FileWriter implements Writer {
  constructor(private filename: string) {
    if (existsSync(filename)) {
      unlinkSync(filename);
    }
  }

  writeOut(binary: string): void {
    appendFileSync(this.filename, binary);
  }
}
