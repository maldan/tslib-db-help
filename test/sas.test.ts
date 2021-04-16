import * as Chai from 'chai';
import * as Fs from 'fs';
import { DataBase } from '../src/DataBase';
import Moment from 'moment';

interface Sas extends Record<string, unknown> {
  number?: number;
  string?: string;
  date?: Date;
}

describe('Base', function () {
  it('push', async function () {
    const db = await new DataBase('test.db').init();

    await db.createIfNotExists('test', {
      number: 'INTEGER',
      string: 'TEXT',
      date: 'TEXT',
    });

    for (let i = 1; i < 4; i++) {
      const s = await db.push<Sas>('test', {
        number: i,
      });
      Chai.assert.equal(s, i);
    }

    await db.close();
    Fs.unlinkSync('test.db');
  });

  it('find one and all', async function () {
    const db = await new DataBase('test.db').init();

    await db.createIfNotExists('test', {
      number: 'INTEGER',
      string: 'TEXT',
      date: 'TEXT',
    });

    for (let i = 1; i < 4; i++) {
      const s = await db.push<Sas>('test', {
        number: i,
      });
    }

    const s = await db.findOne<Sas>('test', {
      number: 2,
    });
    Chai.assert.equal(s.number, 2);

    const s2 = await db.find<Sas>('test', {});
    Chai.assert.isArray(s2);
    Chai.assert.equal(s2.length, 3);

    await db.close();
    Fs.unlinkSync('test.db');
  });

  it('find with op', async function () {
    const db = await new DataBase('test.db').init();

    await db.createIfNotExists('test', {
      number: 'INTEGER',
      string: 'TEXT',
      date: 'TEXT',
    });

    for (let i = 1; i < 4; i++) {
      await db.push<Sas>('test', {
        number: i,
      });
    }

    const s2 = await db.find<Sas>('test', {
      '>= number': 1,
    });
    Chai.assert.isArray(s2);
    Chai.assert.equal(s2.length, 3);

    const s3 = await db.find<Sas>('test', {
      '> number': 1,
      '< number': 3,
    });
    Chai.assert.isArray(s3);
    Chai.assert.equal(s3.length, 1);
    Chai.assert.equal(s3[0].number, 2);

    await db.close();
    Fs.unlinkSync('test.db');
  });

  it('find with date', async function () {
    const db = await new DataBase('test.db').init();

    await db.createIfNotExists('test', {
      number: 'INTEGER',
      string: 'TEXT',
      date: 'TEXT',
    });

    for (let i = 1; i < 4; i++) {
      await db.push<Sas>('test', {
        date: Moment(new Date()).add(i, 'days').toDate(),
      });
    }

    const s2 = await db.find<Sas>('test', {
      '>= date': Moment(new Date()).add(1, 'days').toDate(),
    });
    Chai.assert.isArray(s2);
    Chai.assert.equal(s2.length, 3);

    const s3 = await db.find<Sas>('test', {
      '= date': Moment(new Date()).add(1, 'days').toDate(),
    });
    Chai.assert.isArray(s3);
    Chai.assert.equal(s3.length, 1);

    await db.close();
    Fs.unlinkSync('test.db');
  });
});
