const axios = require('axios');

const {URL_MAP} = require('./config');

const request = system => {
	const {url} = URL_MAP[system];
	return new Promise((resolve, reject) => {
		axios({url, timeout: 2000}).then(res => {
			if (res.status === 200) {
				resolve(res.data);
			} else {
				reject(new Error('请求错误!'));
			}
		});
	});
};

module.exports = {
	request,
};
