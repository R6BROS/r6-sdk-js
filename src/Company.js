/**
 * @desc Company related API calls
**/
class Company {

	/** @ignore */
	constructor(options) {
		/** @ignore */
		this.api = options.api;
	}

	/**
	* Calls the companyGet public endpoint (GET /company/{companyId}), provides information on one company
	* @param {Object} options
	* @param {string} options.companyId Company id
	* @returns {Promise}
	* @example
		await api.company.get({
			companyId: 12345
		});
	*/
	get(options) {
		return this.api.call({
			path: `/company/id/${options.companyId}`
		}, {}, [200, 404]);
	}

	/**
	* Calls the companyName public endpoint (GET /company/name?name={name}), provides a list of matching company names
	* @param {Object} options
	* @param {string} options.name Name
	* @returns {Promise}
	* @example
		await api.company.names({
			name: 'Apple'
		});
	*/
	getName(options) {
		return this.api.call({
			path: `/company/name?name=${options.name}`
		}, {}, [200, 404]);
	}

};

export default Company;

