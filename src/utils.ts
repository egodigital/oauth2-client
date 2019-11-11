/**
 * This file is part of the @egodigital/oauth2-client distribution.
 * Copyright (c) e.GO Digital GmbH, Aachen, Germany (https://www.e-go-digital.com/)
 *
 * @egodigital/oauth2-client is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation, version 3.
 *
 * @egodigital/oauth2-client is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Converts a value to a string that is not (null) and not (undefined), if needed.
 *
 * @param {any} val The value to convert.
 * 
 * @return {string} Value as string.
 */
export function toStringSafe(val: any): string {
    if ('string' === typeof val) {
        return val;
    }

    if ('undefined' === typeof val || null === val) {
        return '';
    }

    if (val instanceof Error) {
        return `[${val.name}] '${val.message}'

${val.stack}`;
    }

    if ('function' === typeof val['toString']) {
        return String(val.toString());
    }

    return String(val);
}
