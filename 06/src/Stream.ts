export interface Stream {
  readNextLine(): Promise<string>;
  rewind(): void;
  hasNextCommand(): boolean;
}
