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

import * as got from 'got';
import { getBaseUrl, getClientCredentials } from './config';
import { toStringSafe } from './utils';


/**
 * Revokes an access token.
 *
 * @param {string} accessToken The token to revoke.
 */
export async function revokeToken(accessToken: string): Promise<void> {
    accessToken = toStringSafe(accessToken)
        .trim();

    const { client_id, client_secret } = getClientCredentials();

    const RESPONSE = await got.post(
        getBaseUrl() + 'oauth/token/revoke',
        {
            body: {
                'token': accessToken,
            },
            headers: {
                'Authorization': `Basic ${
                    Buffer.from(`${client_id}:${client_secret}`, 'utf8')
                        .toString('base64')
                    }`,
            },
            form: true,
            json: true,
            throwHttpErrors: false,
            timeout: 10000,
        }
    );

    if (200 !== RESPONSE.statusCode) {
        throw new Error(`Unexpected response: [${RESPONSE.statusCode}] '${RESPONSE.statusMessage}'`);
    }
}


export * from './clients';
export * from './users';
