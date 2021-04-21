import * as MysqlDriver from 'mysql2';
import { Driver } from '../Driver';

export class MySQL extends Driver {
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
    super();

    this._host = host;
    this._user = user;
    this._password = password;
    this._database = database;
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
      `INSERT INTO \`${table}\`(${params.join(',')}) VALUES (${Object.keys(newObject).join(',')})`,
      newObject,
    );

    return r[0].insertId;

    /*try {
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
    }*/
  }
}
