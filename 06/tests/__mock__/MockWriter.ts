import { Writer } from "../../src/Writer";

export class MockWriter implements Writer {
  writeOut(_binary: string) {
    // nop
  }
}
