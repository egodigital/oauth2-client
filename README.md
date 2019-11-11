[![npm](https://img.shields.io/npm/v/@egodigital/oauth2-client.svg)](https://www.npmjs.com/package/@egodigital/oauth2-client)

# @egodigital/oauth2-client

Functions and classes for easily handling [OAuth 2](https://oauth.net/2/) operations, written for [Node.js 10+](https://nodejs.org/dist/latest-v10.x/docs/api/) in [TypeScript](https://www.typescriptlang.org/).

## Install

Execute the following command from your project folder, where your `package.json` file is stored:

```bash
npm install --save @egodigital/oauth2-client
```

## Documentation

API documentation can be found [here](https://egodigital.github.io/oauth2-client/).

## Usage

First define the following environment variables:

| Name                   | Description                          | Example                                |
|------------------------|--------------------------------------|----------------------------------------|
| `OAUTH2_CLIENT_ID`     | The ID of the OAuth2 client.         | `147a67e2-a5f0-43b5-90d3-0deb35895826` |
| `OAUTH2_CLIENT_SECRET` | The secret of the OAuth2 client.     | `ASitBUoQ7ovXVDc6hPUzq`                |
| `OAUTH2_KEY`           | The key for the admin API.           | `ou3I3Rj8UdBChAgAdzNkeF`               |
| `OAUTH2_URL`           | The base URL of the OAuth 2 service. | `https://oauth2.example.com`           |

### Tokens

#### Get an user token

```typescript
import { getUserToken } from '@egodigital/oauth2-client';

console.log(
    await getUserToken('myUsername', 'myP@ssword123!')
);
```

#### Check user info

```typescript
import { getUserInfo } from '@egodigital/oauth2-client';

console.log(
    await getUserInfo('myAccessToken')
);
```

#### Remove user token

```typescript
import { revokeToken } from '@egodigital/oauth2-client';

console.log(
    await revokeToken('myAccessToken')
);
```

### Admin API

#### Clients

##### Create a client

```typescript
import { createClient } from '@egodigital/oauth2-client';

console.log(
    await createClient({
        'name': 'My awesome app',
    })
);
```

##### List all clients

```typescript
import { getClients } from '@egodigital/oauth2-client';

console.log(
    await getClients()
);
```

##### Get a specific client

```typescript
import { getClient } from '@egodigital/oauth2-client';

console.log(
    await getClient('myClientId')
);
```

##### Delete a client

```typescript
import { deleteClient } from '@egodigital/oauth2-client';

console.log(
    await deleteClient('myClientId')
);
```
