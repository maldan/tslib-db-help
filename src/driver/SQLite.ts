import * as SQL3 from 'sqlite3';
import SHA1 from 'sha1';
import { Database, open } from 'sqlite';
import { IDriver } from './IDriver';
import { Util } from '../Util';
import { DataBaseError } from '../error/DataBaseError';

export class SQLite implements IDriver {
  path: string;
  db!: Database;

  constructor(path: string) {
    this.path = path;
  }

  count(table: string, where: Record<string, unknown>): Promise<any> {
    throw new Error('Method not implemented.');
  }

  query(query: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async initSessionTable(): Promise<void> {
    await this.db.run(`
      CREATE TABLE IF NOT EXISTS "session" (
        "id" INTEGER,
        "accessToken" TEXT,
        "userId" INTEGER DEFAULT 0,
        "created" INTEGER,
        PRIMARY KEY("id" AUTOINCREMENT)
      );
    `);
  }

  async saveSession(userId: number): Promise<string> {
    const accessToken = SHA1(Math.random() + '_sasageo_' + Math.random());
    await this.db.run(
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
    const session = (await this.db.get(`SELECT * FROM "session" WHERE accessToken=$accessToken`, {
      $accessToken: accessToken,
    })) as { accessToken: string; userId: number };
    if (!session) {
      throw new DataBaseError(`Session not found!`);
    }

    // User
    const user = (await this.db.get(`SELECT * FROM "user" WHERE id=$userId`, {
      $userId: session.userId,
    })) as T;
    if (!user) {
      throw new DataBaseError(`User not found!`);
    }
    return user;
  }

  async push(table: string, data: Record<string, unknown>): Promise<number> {
    const params = Object.keys(data);
    const newObject: { [x: string]: unknown } = {};

    for (const s in data) {
      if (data[s] instanceof Date) {
        // @ts-ignore
        data[s] = Util.convertDate(data[s] as Date);
      }
      newObject['$' + s] = data[s];
    }

    const r = await this.db.run(
      `INSERT INTO \`${table}\`(${params.join(',')}) VALUES (${Object.keys(newObject).join(',')})`,
      newObject,
    );

    return Number(r['lastID']);
  }

  async init(): Promise<void> {
    this.db = await open({
      filename: this.path,
      driver: SQL3.Database,
    });
  }

  async createTableIfNotExists(name: string, fields: Record<string, string>): Promise<void> {
    let out = ``;

    // @ts-ignore
    delete fields['id'];

    // Build
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

    // Run command
    await this.db.get(`
      CREATE TABLE IF NOT EXISTS "${name}" (
        "id" INTEGER,
        ${out}
        PRIMARY KEY("id" AUTOINCREMENT)
      );
    `);
  }

  async findOne(table: string, where: Record<string, unknown>): Promise<any> {
    const [condition, obj] = Util.conditionBuilder(where);
    return (
      ((await this.db.get(`SELECT * FROM "${table}" ${condition} LIMIT 1`, obj)) as unknown) || null
    );
  }

  async find(table: string, where: Record<string, unknown>): Promise<any> {
    const [condition, obj] = Util.conditionBuilder(where);
    return (await this.db.all(`SELECT * FROM "${table}" ${condition}`, obj)) as unknown;
  }

  async update(
    table: string,
    data: Record<string, unknown>,
    where: Record<string, unknown>,
  ): Promise<any> {
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

    await this.db.run(`UPDATE "${table}" SET ${set} ${condition}`, { ...newObject, ...obj });
  }

  async delete(table: string, where: Record<string, unknown>): Promise<any> {
    const [condition, obj] = Util.conditionBuilder(where);
    await this.db.run(`DELETE FROM "${table}" ${condition}`, obj);
  }

  async close(): Promise<void> {
    await this.db.close();
  }
}
