export declare type Type_DB_Field = 'INTEGER' | 'TEXT' | 'REAL';
export declare type Type_WhereOp<X> = `${'>=' | '>' | '<=' | '<' | '==' | '!='} ${Extract<keyof X, string>}`;
export declare type Type_WhereClause<X> = Partial<X> | Partial<Record<Type_WhereOp<X>, X[keyof X]>>;
