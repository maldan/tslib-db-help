export declare type Type_DB_Field = 'INTEGER' | 'TEXT' | 'REAL';
export declare class DataBase {
    private _db;
    readonly path: string;
    constructor(path: string);
    init(): Promise<DataBase>;
    close(): Promise<void>;
    private initSessionTable;
    private convertKeyWithOperator;
    private convertDate;
    private conditionBuilder;
    createIfNotExists(name: string, fields: {
        [x: string]: Type_DB_Field;
    }): Promise<void>;
    findOne<T>(table: string, where: {
        [x: string]: unknown;
    }): Promise<T>;
    find<T>(table: string, where: {
        [x: string]: unknown;
    }): Promise<T[]>;
    update(table: string, data: {
        [x: string]: unknown;
    }, where: {
        [x: string]: unknown;
    }): Promise<void>;
    push<T extends {
        [x: string]: unknown;
    }>(table: string, values: T): Promise<number>;
    saveSession(userId: number): Promise<string>;
    getUserByAccessToken<T>(accessToken: string): Promise<T>;
}
