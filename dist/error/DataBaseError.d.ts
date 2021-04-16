export declare class DataBaseError extends Error {
    description: string;
    constructor(description: string);
    toJSON(): {
        description: string;
    };
}
