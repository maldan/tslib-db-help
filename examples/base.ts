import { DataBase, Table } from '../src/DataBase';

interface IBase {
  sas: Table<{ id: number; name: string }>;
}

(async () => {
  const db = await new DataBase<IBase>('data.db').init();

  /*await db.push('session', {
    accessToken: 's',
    userId: 2,
    created: 10,
  });

  const s = await db.findOne('session', {
    accessToken: 's',
    userId: 2,
  });
  console.log(s);*/

  /*await db.update(
    `session`,
    {
      accessToken: 'gagasx',
    },
    {
      id: 10,
    },
  );*/

  await db.createIfNotExists('sas', {
    name: 'TEXT',
    fuck: 'INTEGER',
  });

  /*const x = await db.table.sas.push({
    name: 'GAS',
  });*/
  await db.table.sas.push({ id: 2 });
  await db.table.sas.findOne({ '>= name': 2 });

  // console.log(x);
})();
