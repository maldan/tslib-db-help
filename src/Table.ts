import { IDriver } from './driver/IDriver';
import { Type_WhereClause } from './Types';

export class Table<X> {
  readonly driver!: IDriver;
  readonly name!: string;

  constructor(driver: IDriver, name: string) {
    this.driver = driver;
    this.name = name;
  }

  async findOne(where: Type_WhereClause<X> | Type_WhereClause<X>[]): Promise<X | null> {
    return await this.driver.findOne(this.name, where as any);
  }

  async find(
    where: Type_WhereClause<X> | Type_WhereClause<X>[],
    options: { orderByAsc: string[]; orderByDesc: string[]; limit: number; offset: number },
  ): Promise<X[]> {
    return await this.driver.find(this.name, where as any, options);
  }

  async findOneOrThrowError(where: Type_WhereClause<X> | Type_WhereClause<X>[]): Promise<X> {
    const r = await this.findOne(where);
    if (!r) {
      throw new Error(`Record not found!`);
    }
    return r;
  }

  /*
  async findOneOrThrowError(where: Type_WhereClause<X> | Type_WhereClause<X>[]): Promise<X> {
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
  }
  */

  async update(
    data: Partial<X>,
    where: Type_WhereClause<X> | Type_WhereClause<X>[],
  ): Promise<void> {
    return await this.driver.update(this.name, data as any, where as any);
  }

  async push(values: Partial<X>): Promise<number> {
    return await this.driver.push(this.name, values);
  }

  async delete(where: Type_WhereClause<X> | Type_WhereClause<X>[]): Promise<void> {
    return await this.driver.delete(this.name, where as any);
  }
}
