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
exports.DataBase = void 0;
const Table_1 = require("./Table");
const SQLite_1 = require("./driver/SQLite");
const MySQL_1 = require("./driver/MySQL");
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
                /*const pool = MySQL.createPool({
                  connectionLimit: 10,
                  host: this.host,
                  user: this.user,
                  password: this.password,
                  database: this.db,
                });
                const promisePool = pool.promise();*/
                this._driver = new MySQL_1.MySQL({
                    host: this.host,
                    user: this.user,
                    password: this.password,
                    database: this.db,
                });
            }
            else {
                /*this._driver = await open({
                  filename: this.path,
                  driver: SQL3.Database,
                });*/
                this._driver = new SQLite_1.SQLite(this.path);
            }
            yield this._driver.init();
            yield this._driver.initSessionTable();
            this.table = {};
            return this;
        });
    }
    createTableIfNotExists(name, fields) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._driver.createTableIfNotExists(name, fields);
            // @ts-ignore
            this.table[name] = new Table_1.Table(this._driver, name);
        });
    }
    saveSession(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._driver.saveSession(userId);
        });
    }
    getUserByAccessToken(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._driver.getUserByAccessToken(accessToken);
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._driver.close();
        });
    }
}
exports.DataBase = DataBase;
