import * as Chai from 'chai';
import * as Fs from 'fs';
import { DataBase } from '../src/DataBase';
import Moment from 'moment';
import { Util } from '../src/Util';
import { Table } from '../src/Table';

interface ITest extends Record<string, unknown> {
  number?: number;
  string?: string;
  x_date?: Date;
}

interface IBase {
  test: Table<ITest>;
}

let DB: DataBase<IBase>;

describe('MySql Test', function () {
  /*before(async function () {
    DB = await new DataBase<IBase>(`mysql://root:793150@localhost/subrent`).init();

    await DB.createTableIfNotExists<ITest>('test', {
      number: 'INTEGER',
      string: 'TEXT',
      x_date: 'TEXT',
    });
  });

  it('mysql', async function () {
    for (let i = 1; i < 4; i++) {
      const s = await DB.table.test.push({
        number: i,
      });
      Chai.assert.equal(s, i);
    }
  });

  it('find one and all', async function () {
    for (let i = 1; i < 4; i++) {
      const s = await DB.table.test.push({
        number: i,
      });
    }

    const s = await DB.table.test.findOne({
      number: 2,
    });
    Chai.assert.equal(s?.number, 2);


  });*/
});
