
import _ from 'lodash';
import authentication from './authentication.js';
import initalizeEndpoints from './endpoints.js';

/**
 * @desc [https] The defult protocol of the R6 API server.
 */
const DEFAULT_PROTOCOL = 'https';
/**
 * @desc [443] The defult port of the R6 API server.
 */
const DEFAULT_PORT = 443;
/**
 * @desc The HTTP verbs used by the R6 API.
 */
const METHOD = {
	GET: 'GET',
	POST: 'POST',
	DELETE: 'DELETE'
};

/**
 * @desc Root object to reach the R6 API.
**/
class Api {

	/**
	* Initializes R6 API sdk class with config parameters
	* - Required config properties: apiKey, host, game
	* - Optional config properties: protocol [https], port [443]
	* - apiKey can be ommited when the client needs to change runtime, to use different apiKeys without recreating the Api object
	* @constructor
	* @param {Object} config
	* @param {Object} config.apiKey - The apiKey
	* @param {Object} config.apiKey.key - The apiKey key
	* @param {Object} config.apiKey.secret - The apiKey secret
	* @param {Object} config.protocol - The API service protocol (default: 'https')
	* @param {Object} config.host - The API service hostname
	* @param {Object} config.port - The API service port (default: 443)
	* @example
		import R6Api from 'r6-sdk-js'

		const api = new R6Api({
			apiKey: { key: 'KEY', secret: '12345' },
			protocol: 'https',
			host: 'api.r6bros.eu',
			port: '443',
		});
	*/

	constructor(config) {
		/**
		 * @desc API Configuration object
		 */
		this.config = {
			apiKey: config.apiKey,
			protocol: config.protocol || DEFAULT_PROTOCOL,
			host: config.host,
			port: config.port || DEFAULT_PORT
		};

		initalizeEndpoints(this);
	}

	/**
	 * @type {Object}
	 * @desc The HTTP verbs used by the R6 API.
	 */
	static get METHOD() {
		return METHOD;
	}

	/**
	 * @type {Object}
	 * @desc The HTTP verbs used by the R6 API.
	 */
	get METHOD() {
		return METHOD;
	}

	/**
	* Calls info API public endpoint (GET /) which provides information on the R6 API server
	* @returns {Promise}
	* @example
		await api.info();
	*/
	info() {
		return this.call({ path: '' }, {});
	};

	/**
	* Calls an API public endpoint (can be used directly, but specific functions for endpoints should be preferred)
	* @param {Object} endpoint - An object containing fields: method (use api.METHOD) and path (the api endpoint path without the leading /)
	* @param {Object} body - The reuqest body
	* @param {Array|number} expectedStatusCodes - The status codes that are accepted as valid responses to the call. This value decides wether the Promise is resolved or rejected.
	* @returns {Promise}
	* @example
		await api.call({
			method: api.METHOD.POST,
			path: `/company/${code}`
		}, body, 201);
	*/
	async call(endpoint, body, expectedStatusCodes) {
		const protocol = await import(this.config.protocol);

		const method = endpoint.method || METHOD.GET;
		const path = encodeURI(endpoint.path);

		const options = {
			host: this.config.host,
			port: this.config.port,
			path: path,
			method: method,
			data: body
		};

		options.headers = authentication.prepareHeaders(this.config.apiKey, method, path, options);
		options.headers['Content-Type'] = 'application/json';

		if (expectedStatusCodes && !_.isArray(expectedStatusCodes)) expectedStatusCodes = [expectedStatusCodes];

		return new Promise((resolve, reject) => {
			const req = protocol.request(options, (res) => {
				res.setEncoding('utf-8');

				let responseString = '';

				res.on('data', (data) => { responseString += data; });

				res.on('end', () => {
					if (!expectedStatusCodes || (_.indexOf(expectedStatusCodes, res.statusCode) !== -1)) {
						resolve({ statusCode: res.statusCode, body: JSON.parse(responseString) });
					} else {
						// eslint-disable-next-line prefer-promise-reject-errors
						reject({ statusCode: res.statusCode, body: JSON.parse(responseString) });
					}
				});

				res.on('error', (err) => { reject(err); });

			}).on('error', (err) => { reject(err); });

			if (options.method === METHOD.POST) req.write(JSON.stringify(body));

			req.end();
		});

	}

};

export default Api;

