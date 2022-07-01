[Site](http://r6bros.eu/) |
[API](https://api.r6bros.eu/) |

# R6 SDK - Javascript edition

The R6 SDK gives easy access to the R6 API by providing an abstraction layer and encapsulating the authentication modules.

## Installation

Using yarn:
```shell
$ yarn add r6-sdk-js
```

Using npm:
```shell
$ npm --save i r6-sdk-js
```

## Usage

Node.js:
```js

import R6Api from 'r6-sdk-js'

const config = {
	apiKey: {
		key: 'your key',
		secret: 'your secret'
	},
	host: 'api.r6bros.eu'
};
const api = new R6Api(config);

const response = await api.info();
```

## Documentation

API blueprint is available in compiled [html](doc/blueprint/r6-api-public.html) and [apib](doc/blueprint/r6-api-public.apib) format.

ESDoc can also be generated by running the appropriate script:

```shell
$ yarn
$ yarn doc:source
```

## Authentication

Please see the [authentication docs](doc/authentication/api-hmac-authentication.md) for details.

