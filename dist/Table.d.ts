import { Database } from 'sqlite';
import { Type_WhereClause } from './Types';
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
