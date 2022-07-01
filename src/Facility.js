/**
 * @desc Facility related API calls
**/
class Facility {

	/** @ignore */
	constructor(options) {
		/** @ignore */
		this.api = options.api;
	}

	/**
	* Calls the facilityGet public endpoint (GET /facility/{facilityId}), provides information on one facility
	* @param {Object} options
	* @param {string} options.facilityId Facility id
	* @returns {Promise}
	* @example
		await api.facility.get({
			facilityId: 12345
		});
	*/
	get(options) {
		return this.api.call({
			path: `/facility/${options.facilityId}`
		}, {}, [200, 404]);
	}

};

export default Facility;

