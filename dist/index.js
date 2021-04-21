"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataBaseError = exports.Table = exports.DataBase = void 0;
var DataBase_1 = require("./DataBase");
Object.defineProperty(exports, "DataBase", { enumerable: true, get: function () { return DataBase_1.DataBase; } });
var Table_1 = require("./Table");
Object.defineProperty(exports, "Table", { enumerable: true, get: function () { return Table_1.Table; } });
var DataBaseError_1 = require("./error/DataBaseError");
Object.defineProperty(exports, "DataBaseError", { enumerable: true, get: function () { return DataBaseError_1.DataBaseError; } });
