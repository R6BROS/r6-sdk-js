<!-- TITLE: API HMAC Authentication -->

# Summary

The R6 API authentication uses the HMAC-SHA256 algorithm and based on the AWS authentication methods.

# Headers

Requests, that are needed to be authenticated, use header information for request signature verification.

* R6-Algorithm - the signing method version. Currently the only supported method is `R6-HMAC-SHA256`
* R6-Credential - the API key
* R6-Timestamp - Unix epoch in milliseconds
* R6-Nonce - a unique string, that is unique to the API call. To prevent playback attacks a request with the same nonce should be rejected if called a second time.
* R6-Signature - the signature of the request (See later for details)

# Generating the signing key

The API secret is used to generate the signing key. This adds an additional layer of security that every message is hashed with a different key.

The signing key is created by HMAC-SHA256 algorithm where the message is the API key secret and the secret passphrase is the timestamp generated for the request.

 `signingKey = CryptoJS.HmacSHA256(secret, String(timestamp)).toString(CryptoJS.enc.Hex)`


# Signing the request

To sign the request, we first have to create the string representation of the request. For that we take the following components in this order:

* Algorithm - the value of header R6-Algorithm
* Key - the value of header R6-Credential
* Timestamp - the value of header R6-Timestamp
* Nonce - the value of header R6-Nonce
* Request method - GET, POST etc. with all capitals
* Request path - the request path with the query part included(ie. `/facility/:code?index=:index`). Should not the full url but should start with `/`
* Request data - either the json stringified or an empty `{}`

To get the string representation of the request  we concatenate the above mentioned information with pipe characters and with the signing key we create the signature of the request:

`signature = CryptoJS.HmacSHA256(content, signingKey).toString(CryptoJS.enc.Hex);`

# Postman script

This script can be added to Postman as a pre-request script to create the signature info for a request

```javascript
var signRequest = function (apiKey) {

    var CONTENT_SEPARATOR = '|',

    	SIGNING_ALGORITHM = 'R6-HMAC-SHA256',

    	nonce = Math.floor((Math.random() * new Date().getTime()) + 1),
    	signingKey,
        signature,
    	timestamp = new Date().getTime(),
    	contentParts = [],
    	content,

    	urlParts,
    	url;

    contentParts.push(SIGNING_ALGORITHM);
    contentParts.push(apiKey.key);
    contentParts.push(timestamp);
    contentParts.push(nonce);
    contentParts.push(request.method);

    urlParts = request.url.split('/');
    urlParts.shift();
    url = '/' + urlParts.join('/');

    contentParts.push(url);
    try {
        contentParts.push(JSON.stringify(JSON.parse(request.data)));
    } catch (e) {
        contentParts.push(JSON.stringify({}));
    }

    content = contentParts.join(CONTENT_SEPARATOR);

    signingKey = CryptoJS.HmacSHA256(apiKey.secret, String(timestamp)).toString(CryptoJS.enc.Hex);
    signature = CryptoJS.HmacSHA256(content, signingKey).toString(CryptoJS.enc.Hex);

    postman.setGlobalVariable('algorithm', SIGNING_ALGORITHM);
    postman.setGlobalVariable('credential', apiKey.key);
    postman.setGlobalVariable('timestamp', timestamp);
    postman.setGlobalVariable('nonce', nonce);
    postman.setGlobalVariable('signature', signature);

    postman.setGlobalVariable('console', content);

};

postman.setGlobalVariable('signRequest', 'var signRequest = ' + String(signRequest));


```