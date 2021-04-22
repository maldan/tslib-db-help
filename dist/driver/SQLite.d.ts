import { Database } from 'sqlite';
import { IDriver } from './IDriver';
export declare class SQLite implements IDriver {
    path: string;
    db: Database;
    constructor(path: string);
    initSessionTable(): Promise<void>;
    saveSession(userId: number): Promise<string>;
    getUserByAccessToken<T>(accessToken: string): Promise<T>;
    push(table: string, data: Record<string, unknown>): Promise<number>;
    init(): Promise<void>;
    createTableIfNotExists(name: string, fields: Record<string, string>): Promise<void>;
    findOne(table: string, where: Record<string, unknown>): Promise<any>;
    find(table: string, where: Record<string, unknown>): Promise<any>;
    update(table: string, data: Record<string, unknown>, where: Record<string, unknown>): Promise<any>;
    delete(table: string, where: Record<string, unknown>): Promise<any>;
    close(): Promise<void>;
}
