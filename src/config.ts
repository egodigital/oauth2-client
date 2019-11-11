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

import { toStringSafe } from './utils';


/**
 * Client credentials.
 */
export interface ClientCredentials {
    /**
     * The ID of the client.
     */
    client_id: string;
    /**
     * The clientr secret.
     */
    client_secret: string;
}


/**
 * Returns the key for the admin API.
 * 
 * @return {string} The admin API key.
 */
export function getAdminKey(): string {
    return toStringSafe(process.env.OAUTH2_KEY)
        .trim();
}

/**
 * Returns the base URL of the OAuth 2 service.
 * 
 * @return {string} The base URL.
 */
export function getBaseUrl(): string {
    let url = toStringSafe(process.env.OAUTH2_URL)
        .trim();

    if ('' === url) {
        url = 'http://localhost:3000/';
    }

    if (!url.endsWith('/')) {
        url += '/';
    }

    return url;
}

/**
 * Returns the client credentials.
 * 
 * @return {ClientCredentials} The credentials.
 */
export function getClientCredentials(): ClientCredentials {
    return {
        client_id: toStringSafe(process.env.OAUTH2_CLIENT_ID)
            .trim(),
        client_secret: toStringSafe(process.env.OAUTH2_CLIENT_SECRET)
            .trim(),
    };
}
