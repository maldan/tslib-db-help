import { Driver } from '../Driver';

export class SQLite extends Driver {
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
    await this.query(`
      CREATE TABLE IF NOT EXISTS "${name}" (
        "id" INTEGER,
        ${out}
        PRIMARY KEY("id" AUTOINCREMENT)
      );
    `);
  }
}
