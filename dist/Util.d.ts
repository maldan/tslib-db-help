export declare class Util {
    static convertKeyWithOperator(key: string): string;
    static convertDate(date: Date): string;
    static convertOp(op: string): string;
    private static conditionBuilder_t;
    static conditionBuilder(where: Record<string, unknown> | Record<string, unknown>[]): [string, Record<string, unknown>];
}
