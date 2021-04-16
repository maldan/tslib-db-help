import { DataBase } from '../src/DataBase';

(async () => {
  const db = await new DataBase('data.db').init();

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

  const x = await db.push('sas', {
    name: 'GAS',
  });
  await db.push('sas', { x: 2 });
  console.log(x);
})();
