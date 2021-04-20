"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
class Util {
    static convertKeyWithOperator(key) {
        return key
            .replace('< ', 'lt_')
            .replace('> ', 'gt_')
            .replace('<= ', 'lte_')
            .replace('>= ', 'gte_')
            .replace('= ', 'eq_');
    }
    static convertDate(date) {
        return JSON.stringify(date).replace(/"/g, '').replace('T', ' ').split('.')[0];
    }
    static conditionBuilder(where) {
        let condition = '';
        const newObject = {};
        for (const key in where) {
            if (where[key] instanceof Date) {
                newObject['$' + Util.convertKeyWithOperator(key)] = Util.convertDate(where[key]);
            }
            else {
                newObject['$' + Util.convertKeyWithOperator(key)] = where[key];
            }
        }
        if (Array.isArray(where)) {
        }
        else {
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
                    condition += `date(\`${key}\`) ${op} date($${Util.convertKeyWithOperator(originalKey)}) AND `;
                }
                else {
                    condition += `\`${key}\` ${op} $${Util.convertKeyWithOperator(originalKey)} AND `;
                }
            }
            condition = condition.slice(0, -4);
        }
        return [condition, newObject];
    }
}
exports.Util = Util;
