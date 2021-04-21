"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
const DataBaseError_1 = require("./error/DataBaseError");
const Util_1 = require("./Util");
class Table {
    constructor(db, name) {
        this.db = db;
        this.name = name;
    }
    findOneOrThrowError(where) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.findOne(where);
            if (!r) {
                throw new Error(`Record not found!`);
            }
            return r;
        });
    }
    findOne(where) {
        return __awaiter(this, void 0, void 0, function* () {
            const [condition, obj] = Util_1.Util.conditionBuilder(where);
            return ((yield this.db.get(`SELECT * FROM "${this.name}" ${condition} LIMIT 1`, obj)) || null);
        });
    }
    find(where) {
        return __awaiter(this, void 0, void 0, function* () {
            const [condition, obj] = Util_1.Util.conditionBuilder(where);
            const resultList = (yield this.db.all(`SELECT * FROM "${this.name}" ${condition}`, obj));
            return resultList;
        });
    }
    update(data, where) {
        return __awaiter(this, void 0, void 0, function* () {
            const [condition, obj] = Util_1.Util.conditionBuilder(where);
            let set = ``;
            const newObject = {};
            for (const s in data) {
                set += s + '=$__' + s + ', ';
                if (data[s] instanceof Date) {
                    // @ts-ignore
                    data[s] = Util_1.Util.convertDate(data[s]);
                }
                newObject['$__' + s] = data[s];
            }
            set = set.slice(0, -2);
            yield this.db.run(`UPDATE "${this.name}" SET ${set} ${condition}`, Object.assign(Object.assign({}, newObject), obj));
        });
    }
    delete(where) {
        return __awaiter(this, void 0, void 0, function* () {
            const [condition, obj] = Util_1.Util.conditionBuilder(where);
            yield this.db.run(`DELETE FROM "${this.name}" ${condition}`, obj);
        });
    }
    push(values) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = Object.keys(values);
            const newObject = {};
            for (const s in values) {
                if (values[s] instanceof Date) {
                    // @ts-ignore
                    values[s] = Util_1.Util.convertDate(values[s]);
                }
                newObject['$' + s] = values[s];
            }
            try {
                return (yield this.db.run(`INSERT INTO "${this.name}"(${params.join(',')}) VALUES (${Object.keys(newObject).join(',')})`, newObject))['lastID'];
            }
            catch (e) {
                throw new DataBaseError_1.DataBaseError(e);
            }
        });
    }
}
exports.Table = Table;
