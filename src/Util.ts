export class Util {
  static convertKeyWithOperator(key: string): string {
    return key
      .replace('< ', 'lt_')
      .replace('> ', 'gt_')
      .replace('<= ', 'lte_')
      .replace('>= ', 'gte_')
      .replace('== ', 'eq_')
      .replace('!= ', 'neq_');
  }

  static convertDate(date: Date): string {
    return JSON.stringify(date).replace(/"/g, '').replace('T', ' ').split('.')[0];
  }

  static convertOp(op: string): string {
    return op.replace('==', '=').replace('!=', '<>');
  }

  private static conditionBuilder_t(
    where: Record<string, unknown>,
    prefix: string = '',
  ): [string, Record<string, unknown>] {
    let condition = '';

    const newObject: { [x: string]: unknown } = {};
    for (const key in where) {
      if (where[key] instanceof Date) {
        newObject['$' + Util.convertKeyWithOperator(key) + prefix] = Util.convertDate(
          where[key] as Date,
        );
      } else {
        newObject['$' + Util.convertKeyWithOperator(key) + prefix] = where[key];
      }
    }

    // If has any key
    if (Object.keys(where).length) {
      condition = ' WHERE ';
    }

    // Build condition
    for (let key in where) {
      let op = `=`;
      const originalKey = key;
      if (key.split(' ').length > 1) {
        op = key.split(' ')[0];
        key = key.split(' ')[1];
      }

      if (where[originalKey] instanceof Date) {
        condition += `date(\`${key}\`) ${this.convertOp(op)} date($${
          Util.convertKeyWithOperator(originalKey) + prefix
        }) AND `;
      } else {
        condition += `\`${key}\` ${this.convertOp(op)} $${
          Util.convertKeyWithOperator(originalKey) + prefix
        } AND `;
      }
    }
    condition = condition.slice(0, -4);
    return [condition, newObject];
  }

  static conditionBuilder(
    where: Record<string, unknown> | Record<string, unknown>[],
  ): [string, Record<string, unknown>] {
    if (Array.isArray(where)) {
      let condition = ``;
      let obj = {};
      if (where.length > 0) {
        condition = 'WHERE ';
      }
      for (let i = 0; i < where.length; i++) {
        const [a, b] = this.conditionBuilder_t(where[i], `__b${i}`);
        obj = { ...obj, ...b };
        condition += '(' + a.replace(/^ WHERE /, '') + ') OR ';
      }
      condition = condition.slice(0, -4);
      return [condition, obj];
    } else {
      return this.conditionBuilder_t(where);
    }
  }
}
