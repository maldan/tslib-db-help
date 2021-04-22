import { IDriver } from './IDriver';
export declare class MySQL implements IDriver {
    private _host;
    private _user;
    private _password;
    private _database;
    private _pool?;
    constructor({ host, user, password, database, }: {
        host: string;
        user: string;
        password: string;
        database: string;
    });
    initSessionTable(): Promise<void>;
    saveSession(userId: number): Promise<string>;
    getUserByAccessToken<T>(accessToken: string): Promise<T>;
    find(table: string, where: Record<string, unknown>): Promise<any>;
    update(table: string, data: Record<string, unknown>, where: Record<string, unknown>): Promise<void>;
    delete(table: string, data: Record<string, unknown>): Promise<void>;
    close(): Promise<void>;
    init(): Promise<void>;
    query(query: string): Promise<any>;
    createTableIfNotExists(name: string, fields: Record<string, string>): Promise<void>;
    push(table: string, data: Record<string, unknown>): Promise<number>;
    findOne(table: string, where: Record<string, unknown> | Record<string, unknown>[]): Promise<any>;
}
