/**
 * @desc Rating related API calls
**/
class Rating {

	/** @ignore */
	constructor(options) {
		/** @ignore */
		this.api = options.api;
	}

	/**
	* Calls CompanyBasic public endpoint (GET /rating/{companyId}/{year}), provides basic information on one company for one reporting year
	* @param {Object} options
	* @param {string} options.companyId Company id
	* @param {string} options.reportingYear Reporting year
	* @returns {Promise}
	* @example
		await api.rating.getCompanyBasic({
			companyId: 12345,
			reportingYear: 2020
		});
	*/
	getCompanyBasic(options) {
		return this.api.call({
			path: `/rating/${options.companyId}/${options.reportingYear}`
		}, {}, [200, 404]);
	}

};

export default Rating;

