import { Driver } from './Driver';
import { DataBaseError } from './error/DataBaseError';
import { Type_WhereClause } from './Types';
import { Util } from './Util';

export class Table<X> {
  readonly driver!: Driver;
  readonly name!: string;

  constructor(driver: Driver, name: string) {
    this.driver = driver;
    this.name = name;
    console.log('driver', driver);
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

  async push(values: Partial<X>): Promise<number> {
    return await this.driver.push(this.name, values);
  }
}
