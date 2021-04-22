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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQL = void 0;
const MysqlDriver = __importStar(require("mysql2"));
const Util_1 = require("../Util");
class MySQL {
    constructor({ host, user, password, database, }) {
        this._host = host;
        this._user = user;
        this._password = password;
        this._database = database;
    }
    initSessionTable() {
        throw new Error('Method not implemented.');
    }
    saveSession(userId) {
        throw new Error('Method not implemented.');
    }
    getUserByAccessToken(accessToken) {
        throw new Error('Method not implemented.');
    }
    find(table, where) {
        throw new Error('Method not implemented.');
    }
    update(table, data, where) {
        throw new Error('Method not implemented.');
    }
    delete(table, data) {
        throw new Error('Method not implemented.');
    }
    close() {
        throw new Error('Method not implemented.');
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = MysqlDriver.createPool({
                connectionLimit: 10,
                host: this._host,
                user: this._user,
                password: this._password,
                database: this._database,
            });
            this._pool = pool.promise();
        });
    }
    query(query) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const [rows, fields] = yield ((_a = this._pool) === null || _a === void 0 ? void 0 : _a.query(query));
            console.log(rows);
        });
    }
    createTableIfNotExists(name, fields) {
        return __awaiter(this, void 0, void 0, function* () {
            let out = ``;
            // @ts-ignore
            delete fields['id'];
            // Build
            for (const s in fields) {
                out += `\`${s}\` ${fields[s]} `;
                if (fields[s] === 'TEXT') {
                    out += `DEFAULT "" `;
                }
                if (fields[s] === 'INTEGER') {
                    out += `DEFAULT 0 `;
                }
                out += ',\n';
            }
            // Run command
            yield this.query(`
      CREATE TABLE IF NOT EXISTS \`${name}\` ( 
        \`id\` INT NOT NULL AUTO_INCREMENT,
        ${out}
        PRIMARY KEY (\`id\`)
      ) ENGINE = InnoDB;
    `);
        });
    }
    push(table, data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const params = Object.keys(data);
            const newObject = {};
            for (const s in data) {
                if (data[s] instanceof Date) {
                    // @ts-ignore
                    values[s] = Util_1.Util.convertDate(values[s]);
                }
                newObject[s] = data[s];
            }
            const r = yield ((_a = this._pool) === null || _a === void 0 ? void 0 : _a.query(`INSERT INTO \`${table}\`(${params.join(',')}) VALUES (${Object.keys(newObject)
                .map((x) => `:${x}`)
                .join(',')})`, newObject));
            return r[0].insertId;
        });
    }
    /*async findOneOrThrowError(where: Type_WhereClause<X> | Type_WhereClause<X>[]): Promise<X> {
      const r = await this.findOne(where);
      if (!r) {
        throw new Error(`Record not found!`);
      }
      return r;
    }*/
    findOne(table, where) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const [condition, obj] = Util_1.Util.conditionBuilder(where);
            const [rows, fields] = yield ((_a = this._pool) === null || _a === void 0 ? void 0 : _a.query(`SELECT * FROM \`${table}\` ${condition} LIMIT 1`, obj));
            return rows;
        });
    }
}
exports.MySQL = MySQL;
