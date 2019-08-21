export interface FileStream {
  readNextLine(): Promise<string>;
  hasNextCommand(): boolean;
}
