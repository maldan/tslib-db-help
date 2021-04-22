import { Table } from './Table';
import { Type_DB_Field } from './Types';
export declare class DataBase<X extends Record<keyof X, Table<unknown>>> {
    private _driver;
    readonly path: string;
    readonly type: 'sqlite' | 'mysql';
    readonly host: string;
    readonly user: string;
    readonly password: string;
    readonly db: string;
    table: X;
    constructor(path: string);
    init(): Promise<DataBase<X>>;
    createTableIfNotExists<T>(name: keyof X, fields: Record<keyof T, Type_DB_Field>): Promise<void>;
    saveSession(userId: number): Promise<string>;
    getUserByAccessToken<T>(accessToken: string): Promise<T>;
    close(): Promise<void>;
}
