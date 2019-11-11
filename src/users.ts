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
import * as moment from 'moment';
import { getBaseUrl, getClientCredentials } from './config';
import { toStringSafe } from './utils';


/**
 * Result of a 'getUserInfo()' call.
 */
export interface GetUserInfoResult {
    /**
     * The email.
     */
    email?: string;
}

/**
 * Result of a 'getUserToken()' call.
 */
export interface GetUserTokenResult {
    /**
     * The access token.
     */
    accessToken: string;
    /**
     * The timestamp the access token expires.
     */
    accessTokenExpiresAt: moment.Moment;
}


/**
 * Return user info by an access token.
 *
 * @param {string} accessToken The accessToken.
 * 
 * @return {Promise<GetUserInfoResult>} The promise with the result.
 */
export async function getUserInfo(accessToken: string): Promise<GetUserInfoResult> {
    accessToken = toStringSafe(accessToken).trim();

    const RESPONSE = await got.get(
        getBaseUrl() + 'userinfo',
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            json: true,
            throwHttpErrors: false,
            timeout: 10000,
        }
    );

    if (200 !== RESPONSE.statusCode) {
        throw new Error(`Unexpected response: [${RESPONSE.statusCode}] '${RESPONSE.statusMessage}'`);
    }

    return RESPONSE.body;
}

/**
 * Return an access token by username and password.
 *
 * @param {string} username The username.
 * @param {string} password The password.
 * 
 * @return {Promise<GetUserTokenResult>} The promise with the result.
 */
export async function getUserToken(username: string, password: string): Promise<GetUserTokenResult> {
    const { client_id, client_secret } = getClientCredentials();

    const RESPONSE = await got.post(
        getBaseUrl() + 'oauth/token',
        {
            body: {
                'grant_type': 'password',
                'username': toStringSafe(username),
                'password': toStringSafe(password),
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

    return {
        accessToken: RESPONSE.body.accessToken,
        accessTokenExpiresAt: moment.utc(RESPONSE.body.accessTokenExpiresAt),
    };
}
