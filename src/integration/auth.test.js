require('dotenv').config();
 
import Cookies from "js-cookie";
const fetch = require('node-fetch');

const apiPath = process.env.API_PATH;

describe('', () => {
	it(`path set correctly`, () => {
		expect(apiPath).toBe('http://localhost:3000/api/');
	});

	it(`get root resource`, async () => {

		let token = {};
		Cookies.set('hackneyToken', token);

		let response = await fetch(apiPath, {
			method: 'GET'
		}).then(async (res) => {
			const body = await res.arrayBuffer()
			return {
				status: res.status,
				headers: res.headers,
				body
			};
		});

		// expect(response.status).toEqual(200);
	});
})