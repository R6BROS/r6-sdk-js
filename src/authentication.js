import crypto from 'crypto';

/**
* Prepare the request header object with metadata and signatures
* @access private
* @param {Object} apiKey - The apiKey to be used to sign the call
* @param {string} method - One of the Api.METHOD verbs
* @param {string} path - API endpoint path
* @param {Object} request - the request object
* @return {Object}
*/
function prepareHeaders(apiKey, method, path, request) {

	const CONTENT_SEPARATOR = '|';

	const SIGNING_ALGORITHM = 'R6-HMAC-SHA256';

	const nonce = Math.floor((Math.random() * new Date().getTime()) + 1);
	const timestamp = new Date().getTime();
	const contentParts = [];
	const body = request.data || {};

	contentParts.push(SIGNING_ALGORITHM);
	contentParts.push(apiKey.key);
	contentParts.push(timestamp);
	contentParts.push(nonce);
	contentParts.push(method);
	contentParts.push(path);

	contentParts.push(JSON.stringify(body));

	const content = contentParts.join(CONTENT_SEPARATOR);

	const signingKey = crypto.createHmac('sha256', String(timestamp)).update(apiKey.secret).digest('hex');
	const signature = crypto.createHmac('sha256', signingKey).update(content).digest('hex');


	return {
		'Content-Type': 'application/json',
		'R6-Algorithm': SIGNING_ALGORITHM,
		'R6-Credential': apiKey.key,
		'R6-Timestamp': timestamp,
		'R6-Nonce': nonce,
		'R6-Signature': signature
	};

};

export default { prepareHeaders };