"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataBaseError = void 0;
class DataBaseError extends Error {
    constructor(description) {
        super(description);
        this.description = description;
    }
    toJSON() {
        return {
            description: this.description,
        };
    }
}
exports.DataBaseError = DataBaseError;
