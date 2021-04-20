export declare class Util {
    static convertKeyWithOperator(key: string): string;
    static convertDate(date: Date): string;
    static conditionBuilder(where: Record<string, unknown>): [string, Record<string, unknown>];
}
