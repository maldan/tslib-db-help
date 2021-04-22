import * as MysqlDriver from 'mysql2';
import { IDriver } from './IDriver';
import { Util } from '../Util';

export class MySQL implements IDriver {
  private _host: string;
  private _user: string;
  private _password: string;
  private _database: string;
  private _pool?: any;

  constructor({
    host,
    user,
    password,
    database,
  }: {
    host: string;
    user: string;
    password: string;
    database: string;
  }) {
    this._host = host;
    this._user = user;
    this._password = password;
    this._database = database;
  }
  count(table: string, where: Record<string, unknown>): Promise<any> {
    throw new Error('Method not implemented.');
  }
  initSessionTable(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  saveSession(userId: number): Promise<string> {
    throw new Error('Method not implemented.');
  }
  getUserByAccessToken<T>(accessToken: string): Promise<T> {
    throw new Error('Method not implemented.');
  }
  find(table: string, where: Record<string, unknown>): Promise<any> {
    throw new Error('Method not implemented.');
  }
  update(
    table: string,
    data: Record<string, unknown>,
    where: Record<string, unknown>,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(table: string, data: Record<string, unknown>): Promise<void> {
    throw new Error('Method not implemented.');
  }
  close(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async init(): Promise<void> {
    const pool = MysqlDriver.createPool({
      connectionLimit: 10,
      host: this._host,
      user: this._user,
      password: this._password,
      database: this._database,
    });
    this._pool = pool.promise();
  }

  async query(query: string): Promise<any> {
    const [rows, fields] = await this._pool?.query(query);
    console.log(rows);
  }

  async createTableIfNotExists(name: string, fields: Record<string, string>): Promise<void> {
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
    await this.query(`
      CREATE TABLE IF NOT EXISTS \`${name}\` ( 
        \`id\` INT NOT NULL AUTO_INCREMENT,
        ${out}
        PRIMARY KEY (\`id\`)
      ) ENGINE = InnoDB;
    `);
  }

  async push(table: string, data: Record<string, unknown>): Promise<number> {
    const params = Object.keys(data);
    const newObject: { [x: string]: unknown } = {};

    for (const s in data) {
      if (data[s] instanceof Date) {
        // @ts-ignore
        values[s] = Util.convertDate(values[s] as Date);
      }
      newObject[s] = data[s];
    }

    const r = await this._pool?.query(
      `INSERT INTO \`${table}\`(${params.join(',')}) VALUES (${Object.keys(newObject)
        .map((x) => `:${x}`)
        .join(',')})`,
      newObject,
    );

    return r[0].insertId;
  }

  /*async findOneOrThrowError(where: Type_WhereClause<X> | Type_WhereClause<X>[]): Promise<X> {
    const r = await this.findOne(where);
    if (!r) {
      throw new Error(`Record not found!`);
    }
    return r;
  }*/

  async findOne(
    table: string,
    where: Record<string, unknown> | Record<string, unknown>[],
  ): Promise<any> {
    const [condition, obj] = Util.conditionBuilder(where);
    const [rows, fields] = await this._pool?.query(
      `SELECT * FROM \`${table}\` ${condition} LIMIT 1`,
      obj,
    );
    return rows;
  }
}
