export interface FileStream {
  readNextLine(): Promise<string | null>;
  hasNextCommand(): boolean;
}
