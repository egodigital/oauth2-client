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
import { getAdminKey, getBaseUrl } from './config';
import { toStringSafe } from './utils';


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

    let name = toStringSafe(opts.name)
        .trim();
    if ('' !== name) {
        BODY.data = {
            name: name,
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
            timeout: 10000,
        }
    );

    if (200 !== RESPONSE.statusCode) {
        throw new Error(`Unexpected response: [${RESPONSE.statusCode}] '${RESPONSE.statusMessage}'`);
    }

    return RESPONSE.body;
}

/**
 * Tries to delete a client by ID.
 * 
 * @param {string} id The ID of the client.
 * 
 * @return {Promise<boolean>} The promise that indicates if operation was successful or not (client not found).
 */
export async function deleteClient(id: string): Promise<boolean> {
    id = toStringSafe(id).trim();

    const admin_key = getAdminKey();

    const RESPONSE = await got.delete(
        getBaseUrl() + `oauth/clients/${
        encodeURIComponent(id)
        }`,
        {
            headers: {
                'Authorization': `Bearer ${admin_key}`,
            },
            json: true,
            throwHttpErrors: false,
            timeout: 10000,
        }
    );

    if (204 !== RESPONSE.statusCode) {
        if (404 === RESPONSE.statusCode) {
            return false;
        }

        throw new Error(`Unexpected response: [${RESPONSE.statusCode}] '${RESPONSE.statusMessage}'`);
    }

    return true;
}

/**
 * Tries to return a client by ID.
 * 
 * @param {string} id The ID of the client.
 * 
 * @return {Promise<Client|false>} The promise with the client or (false), if not found.
 */
export async function getClient(id: string): Promise<Client | false> {
    id = toStringSafe(id).trim();

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
            timeout: 10000,
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
            timeout: 10000,
        }
    );

    if (200 !== RESPONSE.statusCode) {
        throw new Error(`Unexpected response: [${RESPONSE.statusCode}] '${RESPONSE.statusMessage}'`);
    }

    return RESPONSE.body;
}
