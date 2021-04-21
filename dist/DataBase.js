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
exports.DataBase = void 0;
const SQL3 = __importStar(require("sqlite3"));
const MySQL = __importStar(require("mysql2"));
const sha1_1 = __importDefault(require("sha1"));
const sqlite_1 = require("sqlite");
const DataBaseError_1 = require("./error/DataBaseError");
const Table_1 = require("./Table");
class DataBase {
    constructor(path) {
        this.type = 'sqlite';
        this.host = '';
        this.user = '';
        this.password = '';
        this.db = '';
        this.path = path;
        // Mysql db
        if (path.match(/^mysql:\/\//)) {
            const a = path.replace(/^mysql:\/\//, '');
            const b = a.split('/');
            const [user, password] = b[0].split('@')[0].split(':');
            const host = b[0].split('@')[1];
            const db = b[1].split('?')[0];
            this.user = user;
            this.password = password;
            this.host = host;
            this.db = db;
            this.type = 'mysql';
        }
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.type === 'mysql') {
                const pool = MySQL.createPool({
                    connectionLimit: 10,
                    host: this.host,
                    user: this.user,
                    password: this.password,
                    database: this.db,
                });
                const promisePool = pool.promise();
            }
            else {
                this._driver = yield sqlite_1.open({
                    filename: this.path,
                    driver: SQL3.Database,
                });
            }
            this.table = {};
            yield this.initSessionTable();
            return this;
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._driver.close();
        });
    }
    initSessionTable() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._driver.run(`
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
            yield this._driver.run(`
      CREATE TABLE IF NOT EXISTS "${name}" (
        "id" INTEGER,
        ${out}
        PRIMARY KEY("id" AUTOINCREMENT)
      );
    `);
            // @ts-ignore
            this.table[name] = new Table_1.Table(this._db, name);
        });
    }
    saveSession(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = sha1_1.default(Math.random() + '_sasageo_' + Math.random());
            yield this._driver.run(`INSERT INTO "session"(accessToken, userId, created) VALUES ($accessToken, $userId, $created)`, {
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
            const session = (yield this._driver.get(`SELECT * FROM "session" WHERE accessToken=$accessToken`, {
                $accessToken: accessToken,
            }));
            if (!session) {
                throw new DataBaseError_1.DataBaseError(`Session not found!`);
            }
            // User
            const user = (yield this._driver.get(`SELECT * FROM "user" WHERE id=$userId`, {
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
