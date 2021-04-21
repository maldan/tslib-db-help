export class Driver {
  async init(): Promise<void> {}
  async createTableIfNotExists(name: string, fields: Record<string, string>): Promise<void> {}
  async query(str: string): Promise<any> {}
  async push(table: string, data: Record<string, unknown>): Promise<number> {
    return 0;
  }
  async close(): Promise<void> {}
}
