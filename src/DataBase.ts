import * as SQL3 from 'sqlite3';
import SHA1 from 'sha1';
import { Database, open } from 'sqlite';
import { DataBaseError } from './error/DataBaseError';

export type Type_DB_Field = 'INTEGER' | 'TEXT' | 'REAL';

export class DataBase {
  private _db!: Database;
  readonly path: string;

  constructor(path: string) {
    this.path = path;
  }

  async init(): Promise<DataBase> {
    this._db = await open({
      filename: this.path,
      driver: SQL3.Database,
    });
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

  private convertKeyWithOperator(key: string) {
    return key
      .replace('< ', 'lt_')
      .replace('> ', 'gt_')
      .replace('<= ', 'lte_')
      .replace('>= ', 'gte_')
      .replace('= ', 'eq_');
  }

  private convertDate(date: Date) {
    return JSON.stringify(date).replace(/"/g, '').replace('T', ' ').split('.')[0];
  }

  private conditionBuilder(where: { [x: string]: unknown }): [string, { [x: string]: unknown }] {
    let condition = '';
    const newObject: { [x: string]: unknown } = {};
    for (const key in where) {
      if (where[key] instanceof Date) {
        newObject['$' + this.convertKeyWithOperator(key)] = this.convertDate(where[key] as Date);
      } else {
        newObject['$' + this.convertKeyWithOperator(key)] = where[key];
      }
    }

    if (Array.isArray(where)) {
    } else {
      // If has any key
      if (Object.keys(where).length) {
        condition = ' WHERE ';
      }

      // Build condition
      for (let key in where) {
        let op = `=`;
        const originalKey = key;
        if (key.split(' ').length > 1) {
          op = key.split(' ')[0];
          key = key.split(' ')[1];
        }

        if (where[originalKey] instanceof Date) {
          condition += `date(\`${key}\`) ${op} date($${this.convertKeyWithOperator(
            originalKey,
          )}) AND `;
        } else {
          condition += `\`${key}\` ${op} $${this.convertKeyWithOperator(originalKey)} AND `;
        }
      }
      condition = condition.slice(0, -4);
    }

    return [condition, newObject];
  }

  async createIfNotExists(name: string, fields: { [x: string]: Type_DB_Field }): Promise<void> {
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
  }

  async findOne<T>(table: string, where: { [x: string]: unknown }): Promise<T> {
    const [condition, obj] = this.conditionBuilder(where);
    return ((await this._db.get(
      `SELECT * FROM "${table}" ${condition} LIMIT 1`,
      obj,
    )) as unknown) as T;
  }

  async find<T>(table: string, where: { [x: string]: unknown }): Promise<T[]> {
    const [condition, obj] = this.conditionBuilder(where);
    // console.log(condition, obj);
    return ((await this._db.all(`SELECT * FROM "${table}" ${condition}`, obj)) as unknown) as T[];
  }

  async update(
    table: string,
    data: { [x: string]: unknown },
    where: { [x: string]: unknown },
  ): Promise<void> {
    const [condition, obj] = this.conditionBuilder(where);
    let set = ``;
    const newObject: { [x: string]: unknown } = {};

    for (const s in data) {
      set += s + '=$__' + s + ', ';
      if (data[s] instanceof Date) {
        data[s] = this.convertDate(data[s] as Date);
      }
      newObject['$__' + s] = data[s];
    }
    set = set.slice(0, -2);

    await this._db.run(`UPDATE "${table}" SET ${set} ${condition}`, { ...newObject, ...obj });
  }

  async push<T extends { [x: string]: unknown }>(table: string, values: T): Promise<number> {
    const params = Object.keys(values);
    const newObject: { [x: string]: unknown } = {};

    for (const s in values) {
      if (values[s] instanceof Date) {
        // @ts-ignore
        values[s] = this.convertDate(values[s] as Date);
      }
      newObject['$' + s] = values[s];
    }

    try {
      return (
        await this._db.run(
          `INSERT INTO "${table}"(${params.join(',')}) VALUES (${Object.keys(newObject).join(
            ',',
          )})`,
          newObject,
        )
      )['lastID'] as number;
    } catch (e) {
      throw new DataBaseError(e);
    }
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
