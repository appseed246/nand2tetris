export interface Stream {
  readNextLine(): Promise<string>;
  hasNextCommand(): boolean;
}
