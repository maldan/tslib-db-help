import { IDriver } from './driver/IDriver';
import { Type_WhereClause } from './Types';
export declare class Table<X> {
    readonly driver: IDriver;
    readonly name: string;
    constructor(driver: IDriver, name: string);
    findOne(where: Type_WhereClause<X> | Type_WhereClause<X>[]): Promise<X | null>;
    find(where: Type_WhereClause<X> | Type_WhereClause<X>[], options?: {
        orderByAsc: string[];
        orderByDesc: string[];
        limit: number;
        offset: number;
    }): Promise<X[]>;
    findOneOrThrowError(where: Type_WhereClause<X> | Type_WhereClause<X>[]): Promise<X>;
    update(data: Partial<X>, where: Type_WhereClause<X> | Type_WhereClause<X>[]): Promise<void>;
    push(values: Partial<X>): Promise<number>;
    delete(where: Type_WhereClause<X> | Type_WhereClause<X>[]): Promise<void>;
}
