import { Table } from './Table';
import { IDriver } from './driver/IDriver';
import { SQLite } from './driver/SQLite';
import { MySQL } from './driver/MySQL';
import { Type_DB_Field } from './Types';

export class DataBase<X extends Record<keyof X, Table<unknown>>> {
  private _driver!: IDriver;

  readonly path: string;
  readonly type: 'sqlite' | 'mysql' = 'sqlite';
  readonly host: string = '';
  readonly user: string = '';
  readonly password: string = '';
  readonly db: string = '';

  table!: X;

  constructor(path: string) {
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

  async init(): Promise<DataBase<X>> {
    if (this.type === 'mysql') {
      /*const pool = MySQL.createPool({
        connectionLimit: 10,
        host: this.host,
        user: this.user,
        password: this.password,
        database: this.db,
      });
      const promisePool = pool.promise();*/
      this._driver = new MySQL({
        host: this.host,
        user: this.user,
        password: this.password,
        database: this.db,
      });
    } else {
      /*this._driver = await open({
        filename: this.path,
        driver: SQL3.Database,
      });*/
      this._driver = new SQLite(this.path);
    }

    await this._driver.init();
    await this._driver.initSessionTable();

    this.table = {} as X;

    return this;
  }

  async createTableIfNotExists<T>(
    name: keyof X,
    fields: Record<keyof T, Type_DB_Field>,
  ): Promise<void> {
    await this._driver.createTableIfNotExists(name as string, fields);

    // @ts-ignore
    this.table[name] = new Table(this._driver, name);
  }

  async saveSession(userId: number): Promise<string> {
    return await this._driver.saveSession(userId);
  }

  async getUserByAccessToken<T>(accessToken: string): Promise<T> {
    return await this._driver.getUserByAccessToken(accessToken);
  }

  async close(): Promise<void> {
    await this._driver.close();
  }
}
