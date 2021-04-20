import { Database } from 'sqlite';
export declare type Type_DB_Field = 'INTEGER' | 'TEXT' | 'REAL';
declare type Type_WhereOp<X> = `${'>=' | '>' | '<=' | '<' | '==' | '!='} ${Extract<keyof X, string>}`;
declare type Type_WhereClause<X> = Partial<X> | Partial<Record<Type_WhereOp<X>, X[keyof X]>>;
export declare class Table<X> {
    readonly db: Database;
    readonly name: string;
    constructor(db: Database, name: string);
    findOneOrThrowError(where: Type_WhereClause<X> | Type_WhereClause<X>[]): Promise<X>;
    findOne(where: Type_WhereClause<X> | Type_WhereClause<X>[]): Promise<X | null>;
    find(where: Type_WhereClause<X> | Type_WhereClause<X>[]): Promise<X[]>;
    update(data: Partial<X>, where: Type_WhereClause<X> | Type_WhereClause<X>[]): Promise<void>;
    delete(where: Type_WhereClause<X> | Type_WhereClause<X>[]): Promise<void>;
    push(values: Partial<X>): Promise<number>;
}
export declare class DataBase<X extends Record<keyof X, Table<unknown>>> {
    private _db;
    readonly path: string;
    table: X;
    constructor(path: string);
    init(): Promise<DataBase<X>>;
    close(): Promise<void>;
    private initSessionTable;
    createIfNotExists<T>(name: keyof X, fields: Record<keyof T, Type_DB_Field>): Promise<void>;
    saveSession(userId: number): Promise<string>;
    getUserByAccessToken<T>(accessToken: string): Promise<T>;
}
export {};
