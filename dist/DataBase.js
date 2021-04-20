"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataBase = exports.Table = void 0;
const SQL3 = __importStar(require("sqlite3"));
const sha1_1 = __importDefault(require("sha1"));
const sqlite_1 = require("sqlite");
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
class DataBase {
    constructor(path) {
        this.path = path;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this._db = yield sqlite_1.open({
                filename: this.path,
                driver: SQL3.Database,
            });
            this.table = {};
            yield this.initSessionTable();
            return this;
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._db.close();
        });
    }
    initSessionTable() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._db.run(`
      CREATE TABLE IF NOT EXISTS "session" (
        "id" INTEGER,
        "accessToken" TEXT,
        "userId" INTEGER DEFAULT 0,
        "created" INTEGER,
        PRIMARY KEY("id" AUTOINCREMENT)
      );
    `);
        });
    }
    createIfNotExists(name, fields) {
        return __awaiter(this, void 0, void 0, function* () {
            let out = ``;
            // @ts-ignore
            delete fields['id'];
            for (const s in fields) {
                out += `"${s}" ${fields[s]} `;
                if (fields[s] === 'TEXT') {
                    out += `DEFAULT "" `;
                }
                if (fields[s] === 'INTEGER') {
                    out += `DEFAULT 0 `;
                }
                out += ',\n';
            }
            yield this._db.run(`
      CREATE TABLE IF NOT EXISTS "${name}" (
        "id" INTEGER,
        ${out}
        PRIMARY KEY("id" AUTOINCREMENT)
      );
    `);
            // @ts-ignore
            this.table[name] = new Table(this._db, name);
        });
    }
    saveSession(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = sha1_1.default(Math.random() + '_sasageo_' + Math.random());
            yield this._db.run(`INSERT INTO "session"(accessToken, userId, created) VALUES ($accessToken, $userId, $created)`, {
                $accessToken: accessToken,
                $userId: userId,
                $created: (new Date().getTime() / 1000) | 0,
            });
            return accessToken;
        });
    }
    getUserByAccessToken(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            // Session
            const session = (yield this._db.get(`SELECT * FROM "session" WHERE accessToken=$accessToken`, {
                $accessToken: accessToken,
            }));
            if (!session) {
                throw new DataBaseError_1.DataBaseError(`Session not found!`);
            }
            // User
            const user = (yield this._db.get(`SELECT * FROM "user" WHERE id=$userId`, {
                $userId: session.userId,
            }));
            if (!user) {
                throw new DataBaseError_1.DataBaseError(`User not found!`);
            }
            return user;
        });
    }
}
exports.DataBase = DataBase;
