import * as Chai from 'chai';
import * as Fs from 'fs';
import { DataBase } from '../src/DataBase';
import Moment from 'moment';
import { Table } from '../src/Table';

interface Sas extends Record<string, unknown> {
  number?: number;
  string?: string;
  x_date?: Date;
}

interface IBase {
  test: Table<Sas>;
}

let DB: DataBase<IBase>;

describe('Sqlite', function () {
  before(async function () {
    DB = await new DataBase<IBase>('test.db').init();

    await DB.createTableIfNotExists<Sas>('test', {
      number: 'INTEGER',
      string: 'TEXT',
      x_date: 'TEXT',
    });
  });

  it('push', async function () {
    for (let i = 1; i < 4; i++) {
      const s = await DB.table.test.push({
        number: i,
      });
      Chai.assert.equal(s, i);
    }

    await DB.table.test.delete({});
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

    const s2 = await DB.table.test.find({});
    Chai.assert.isArray(s2);
    Chai.assert.equal(s2.length, 3);

    await DB.table.test.delete({});
  });

  it('find with op', async function () {
    for (let i = 1; i < 4; i++) {
      await DB.table.test.push({
        number: i,
      });
    }

    const s2 = await DB.table.test.find({
      '>= number': 1,
    });
    Chai.assert.isArray(s2);
    Chai.assert.equal(s2.length, 3);

    const s3 = await DB.table.test.find({
      '> number': 1,
      '< number': 3,
    });
    Chai.assert.isArray(s3);
    Chai.assert.equal(s3.length, 1);
    Chai.assert.equal(s3[0].number, 2);

    await DB.table.test.delete({});
  });

  it('find with or', async function () {
    for (let i = 1; i < 4; i++) {
      await DB.table.test.push({
        number: i,
      });
    }

    const s2 = await DB.table.test.find([
      {
        '== number': 1,
      },
      {
        '== number': 3,
      },
    ]);
    Chai.assert.isArray(s2);
    Chai.assert.equal(s2.length, 2);
    Chai.assert.equal(s2[0].number, 1);
    Chai.assert.equal(s2[1].number, 3);

    await DB.table.test.delete({});
  });

  it('find with date', async function () {
    for (let i = 0; i < 4; i++) {
      await DB.table.test.push({
        x_date: Moment(new Date()).add(i, 'days').toDate(),
      });
    }

    const s2 = await DB.table.test.find({
      '>= x_date': Moment(new Date()).add(1, 'days').toDate(),
    });
    Chai.assert.isArray(s2);
    Chai.assert.equal(s2.length, 3);

    const s3 = await DB.table.test.find({
      '== x_date': Moment(new Date()).add(1, 'days').toDate(),
    });

    Chai.assert.isArray(s3);
    Chai.assert.equal(s3.length, 1);

    await DB.table.test.delete({});
  });

  after(async function () {
    await DB.close();
    Fs.unlinkSync('test.db');
  });
});
