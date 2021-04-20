import * as SQL3 from 'sqlite3';
import SHA1 from 'sha1';
import { Database, open } from 'sqlite';
import { DataBaseError } from './error/DataBaseError';
import { Util } from './Util';

export type Type_DB_Field = 'INTEGER' | 'TEXT' | 'REAL';

type Type_WhereOp<X> =
  | `>= ${Extract<keyof X, string>}`
  | `> ${Extract<keyof X, string>}`
  | `<= ${Extract<keyof X, string>}`
  | `< ${Extract<keyof X, string>}`
  | `= ${Extract<keyof X, string>}`;
type Type_WhereClause<X> = Partial<X> | Record<Type_WhereOp<X>, X[keyof X]>;

export class Table<X> {
  readonly db!: Database;
  readonly name!: string;

  constructor(db: Database, name: string) {
    this.db = db;
    this.name = name;
  }

  async findOne(where: Type_WhereClause<X>): Promise<X> {
    const [condition, obj] = Util.conditionBuilder(where);
    return ((await this.db.get(
      `SELECT * FROM "${this.name}" ${condition} LIMIT 1`,
      obj,
    )) as unknown) as X;
  }

  async find(where: Type_WhereClause<X>): Promise<X[]> {
    const [condition, obj] = Util.conditionBuilder(where);
    const resultList = ((await this.db.all(
      `SELECT * FROM "${this.name}" ${condition}`,
      obj,
    )) as unknown) as X[];
    return resultList;
  }

  async update(data: Partial<X>, where: Type_WhereClause<X>): Promise<void> {
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

  async delete(where: Type_WhereClause<X>): Promise<void> {
    const [condition, obj] = Util.conditionBuilder(where);

    await this.db.run(`DELETE FROM "${this.name}" ${condition}`, obj);
  }

  async push(values: Partial<X>): Promise<number> {
    const params = Object.keys(values);
    const newObject: { [x: string]: unknown } = {};

    for (const s in values) {
      if (values[s] instanceof Date) {
        // @ts-ignore
        values[s] = Util.convertDate(values[s] as Date);
      }
      newObject['$' + s] = values[s];
    }

    try {
      return (
        await this.db.run(
          `INSERT INTO "${this.name}"(${params.join(',')}) VALUES (${Object.keys(newObject).join(
            ',',
          )})`,
          newObject,
        )
      )['lastID'] as number;
    } catch (e) {
      throw new DataBaseError(e);
    }
  }
}

export class DataBase<X extends Record<keyof X, Table<unknown>>> {
  private _db!: Database;
  readonly path: string;

  table!: X;

  constructor(path: string) {
    this.path = path;
  }

  async init(): Promise<DataBase<X>> {
    this._db = await open({
      filename: this.path,
      driver: SQL3.Database,
    });
    this.table = {} as X;
    await this.initSessionTable();
    return this;
  }

  async close(): Promise<void> {
    await this._db.close();
  }

  private async initSessionTable(): Promise<void> {
    await this._db.run(`
      CREATE TABLE IF NOT EXISTS "session" (
        "id" INTEGER,
        "accessToken" TEXT,
        "userId" INTEGER DEFAULT 0,
        "created" INTEGER,
        PRIMARY KEY("id" AUTOINCREMENT)
      );
    `);
  }

  async createIfNotExists<T extends Record<string, unknown>>(
    name: keyof X,
    fields: Record<keyof T, Type_DB_Field>,
  ): Promise<void> {
    let out = ``;

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

    await this._db.run(`
      CREATE TABLE IF NOT EXISTS "${name}" (
        "id" INTEGER,
        ${out}
        PRIMARY KEY("id" AUTOINCREMENT)
      );
    `);

    // @ts-ignore
    this.table[name] = new Table(this._db, name);
  }

  async saveSession(userId: number): Promise<string> {
    const accessToken = SHA1(Math.random() + '_sasageo_' + Math.random());
    await this._db.run(
      `INSERT INTO "session"(accessToken, userId, created) VALUES ($accessToken, $userId, $created)`,
      {
        $accessToken: accessToken,
        $userId: userId,
        $created: (new Date().getTime() / 1000) | 0,
      },
    );
    return accessToken;
  }

  async getUserByAccessToken<T>(accessToken: string): Promise<T> {
    // Session
    const session = (await this._db.get(`SELECT * FROM "session" WHERE accessToken=$accessToken`, {
      $accessToken: accessToken,
    })) as { accessToken: string; userId: number };
    if (!session) {
      throw new DataBaseError(`Session not found!`);
    }

    // User
    const user = (await this._db.get(`SELECT * FROM "user" WHERE id=$userId`, {
      $userId: session.userId,
    })) as T;
    if (!user) {
      throw new DataBaseError(`User not found!`);
    }
    return user;
  }
}
