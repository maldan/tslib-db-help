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
class Table {
    constructor(driver, name) {
        this.driver = driver;
        this.name = name;
    }
    findOne(where) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.driver.findOne(this.name, where);
        });
    }
    find(where) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.driver.find(this.name, where);
        });
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
    /*async findOneOrThrowError(where: Type_WhereClause<X> | Type_WhereClause<X>[]): Promise<X> {
      const r = await this.findOne(where);
      if (!r) {
        throw new Error(`Record not found!`);
      }
      return r;
    }
  
    async findOne(where: Type_WhereClause<X> | Type_WhereClause<X>[]): Promise<X | null> {
      const [condition, obj] = Util.conditionBuilder(where);
      return (
        (((await this.db.get(
          `SELECT * FROM "${this.name}" ${condition} LIMIT 1`,
          obj,
        )) as unknown) as X) || null
      );
    }
  
    async find(where: Type_WhereClause<X> | Type_WhereClause<X>[]): Promise<X[]> {
      const [condition, obj] = Util.conditionBuilder(where);
      const resultList = ((await this.db.all(
        `SELECT * FROM "${this.name}" ${condition}`,
        obj,
      )) as unknown) as X[];
      return resultList;
    }
  
    async update(
      data: Partial<X>,
      where: Type_WhereClause<X> | Type_WhereClause<X>[],
    ): Promise<void> {
      const [condition, obj] = Util.conditionBuilder(where);
      let set = ``;
      const newObject: { [x: string]: unknown } = {};
  
      for (const s in data) {
        set += s + '=$__' + s + ', ';
        if (data[s] instanceof Date) {
          // @ts-ignore
          data[s] = Util.convertDate(data[s] as Date);
        }
        newObject['$__' + s] = data[s];
      }
      set = set.slice(0, -2);
  
      await this.db.run(`UPDATE "${this.name}" SET ${set} ${condition}`, { ...newObject, ...obj });
    }
  
    async delete(where: Type_WhereClause<X> | Type_WhereClause<X>[]): Promise<void> {
      const [condition, obj] = Util.conditionBuilder(where);
  
      await this.db.run(`DELETE FROM "${this.name}" ${condition}`, obj);
    }*/
    update(data, where) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.driver.update(this.name, data, where);
        });
    }
    push(values) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.driver.push(this.name, values);
        });
    }
    delete(where) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.driver.delete(this.name, where);
        });
    }
}
exports.Table = Table;
