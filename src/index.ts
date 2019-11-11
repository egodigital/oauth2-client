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


/**
 * A client object.
 */
export interface Client {
    /**
     * The ID of the client.
     */
    client_id: string;
    /**
     * The (display) name of the client, if available.
     */
    client_name?: string;
    /**
     * The client secrect.
     */
    client_secret?: string;
}

interface ClientCredentials {
    client_id: string;
    client_secret: string;
}

/**
 * Options for a 'createClient()' call.
 */
export interface CreateClientOptions {
    /**
     * The custom name.
     */
    name?: string;
}

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
 * Creates a new client.
 *
 * @param {CreateClientOptions} [opts] The custom options.
 * 
 * @return {Promise<Client>} The promise with the new client.
 */
export async function createClient(opts?: CreateClientOptions): Promise<Client> {
    if (!opts) {
        opts = {} as any;
    }

    const admin_key = getAdminKey();

    const BODY: any = {};

    let name = opts.name;
    if (name) {
        BODY.data = {
            name: String(opts.name)
                .trim(),
        };
    }

    const RESPONSE = await got.post(
        getBaseUrl() + `oauth/clients`,
        {
            body: BODY,
            headers: {
                'Authorization': `Bearer ${admin_key}`,
            },
            json: true,
            throwHttpErrors: false,
            timeout: 5000,
        }
    );

    if (200 !== RESPONSE.statusCode) {
        throw new Error(`Unexpected response: [${RESPONSE.statusCode}] '${RESPONSE.statusMessage}'`);
    }

    return RESPONSE.body;
}


/**
 * Tries to return a client by ID.
 * 
 * @param {string} id The ID of the client.
 * 
 * @return {Promise<Client|false>} The promise with the client or (false), if not found.
 */
export async function getClient(id: string): Promise<Client | false> {
    id = String(id).trim();

    const admin_key = getAdminKey();

    const RESPONSE = await got.get(
        getBaseUrl() + `oauth/clients/${
            encodeURIComponent(id)
        }`,
        {
            headers: {
                'Authorization': `Bearer ${admin_key}`,
            },
            json: true,
            throwHttpErrors: false,
            timeout: 5000,
        }
    );

    if (200 !== RESPONSE.statusCode) {
        if (404 === RESPONSE.statusCode) {
            return false;
        }

        throw new Error(`Unexpected response: [${RESPONSE.statusCode}] '${RESPONSE.statusMessage}'`);
    }

    return RESPONSE.body;
}


/**
 * Returns a list of all clients.
 * 
 * @return {Promise<Client[]>} The promise with the list of clients.
 */
export async function getClients(): Promise<Client[]> {
    const admin_key = getAdminKey();

    const RESPONSE = await got.get(
        getBaseUrl() + 'oauth/clients',
        {
            headers: {
                'Authorization': `Bearer ${admin_key}`,
            },
            json: true,
            throwHttpErrors: false,
            timeout: 5000,
        }
    );

    if (200 !== RESPONSE.statusCode) {
        throw new Error(`Unexpected response: [${RESPONSE.statusCode}] '${RESPONSE.statusMessage}'`);
    }

    return RESPONSE.body;
}

/**
 * Return user info by an access token.
 *
 * @param {string} accessToken The accessToken.
 * 
 * @return {Promise<GetUserInfoResult>} The promise with the result.
 */
export async function getUserInfo(accessToken: string): Promise<GetUserInfoResult> {
    accessToken = String(accessToken).trim();

    const RESPONSE = await got.get(
        getBaseUrl() + 'userinfo',
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            json: true,
            throwHttpErrors: false,
            timeout: 5000,
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
                'username': String(username),
                'password': String(password),
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
            timeout: 5000,
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

/**
 * Revokes an access token.
 *
 * @param {string} accessToken The token to revoke.
 */
export async function revokeToken(accessToken: string): Promise<void> {
    accessToken = String(accessToken).trim();

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
            timeout: 5000,
        }
    );

    if (200 !== RESPONSE.statusCode) {
        throw new Error(`Unexpected response: [${RESPONSE.statusCode}] '${RESPONSE.statusMessage}'`);
    }
}


function getAdminKey(): string {
    return process.env.OAUTH2_KEY
        .trim();
}

function getBaseUrl(): string {
    let url = process.env.OAUTH2_URL
        .trim();

    if ('' === url) {
        url = 'http://localhost:3000/';
    }

    if (!url.endsWith('/')) {
        url += '/';
    }

    return url;
}

function getClientCredentials(): ClientCredentials {
    return {
        client_id: process.env.OAUTH2_CLIENT_ID
            .trim(),
        client_secret: process.env.OAUTH2_CLIENT_SECRET
            .trim(),
    };
}
