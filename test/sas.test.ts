import * as Chai from 'chai';
import * as Fs from 'fs';
import { DataBase, Table } from '../src/DataBase';
import Moment from 'moment';
import { Util } from '../src/Util';

interface Sas extends Record<string, unknown> {
  number?: number;
  string?: string;
  date?: Date;
}

interface IBase {
  test: Table<Sas>;
}

describe('Base', function () {
  it('push', async function () {
    const x = Util.conditionBuilder([
      {
        a: 1,
        d: new Date(),
        x: 'd',
        '<= x': 3,
      },
      {
        a: 1,
        d: new Date(),
        x: 'd',
        '<= x': 3,
      },
    ]);
    console.log(x);
  });
});
