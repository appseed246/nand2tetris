export interface FileStream {
  readNextLine(): Promise<string>;
  rewind(): void;
  hasNextCommand(): boolean;
}
