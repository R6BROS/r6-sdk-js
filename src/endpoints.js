import Facility from './Facility.js';
import Company from './Company.js';
import Rating from './Rating.js';

export default (api) => {
	api.facility = new Facility({ api: api });
	api.company = new Company({ api: api });
	api.rating = new Rating({ api: api });
};

