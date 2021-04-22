export type Type_DB_Field = 'INTEGER' | 'TEXT' | 'REAL' | 'JSON';
export type Type_WhereOp<X> = `${'>=' | '>' | '<=' | '<' | '==' | '!='} ${Extract<
  keyof X,
  string
>}`;
export type Type_WhereClause<X> = Partial<X> | Partial<Record<Type_WhereOp<X>, X[keyof X]>>;
