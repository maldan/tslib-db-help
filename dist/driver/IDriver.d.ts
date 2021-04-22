export interface IDriver {
    /** Init */
    init(): Promise<void>;
    initSessionTable(): Promise<void>;
    /** Session */
    saveSession(userId: number): Promise<string>;
    getUserByAccessToken<T>(accessToken: string): Promise<T>;
    /** Raw query */
    query(query: string): Promise<any>;
    /** Work with talbes */
    createTableIfNotExists(name: string, fields: Record<string, string>): Promise<void>;
    /** Aggregation */
    count(table: string, where: Record<string, unknown>): Promise<any>;
    /** Search */
    findOne(table: string, where: Record<string, unknown>): Promise<any>;
    find(table: string, where: Record<string, unknown>, options?: {
        orderByAsc: string[];
        orderByDesc: string[];
        limit: number;
        offset: number;
    }): Promise<any>;
    /** Update */
    update(table: string, data: Record<string, unknown>, where: Record<string, unknown>): Promise<void>;
    /** Add/Remove */
    push(table: string, data: Record<string, unknown>): Promise<number>;
    delete(table: string, where: Record<string, unknown>): Promise<void>;
    /** Close db */
    close(): Promise<void>;
}
