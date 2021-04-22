export interface IDriver {
    init(): Promise<void>;
    initSessionTable(): Promise<void>;
    saveSession(userId: number): Promise<string>;
    getUserByAccessToken<T>(accessToken: string): Promise<T>;
    createTableIfNotExists(name: string, fields: Record<string, string>): Promise<void>;
    findOne(table: string, where: Record<string, unknown>): Promise<any>;
    find(table: string, where: Record<string, unknown>): Promise<any>;
    update(table: string, data: Record<string, unknown>, where: Record<string, unknown>): Promise<void>;
    push(table: string, data: Record<string, unknown>): Promise<number>;
    delete(table: string, where: Record<string, unknown>): Promise<void>;
    close(): Promise<void>;
}
