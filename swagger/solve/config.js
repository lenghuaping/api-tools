const {handleError} = require('../config/function');
const {ERROR_TEXT} = require('../config/config');

const handleESType = data => Object.prototype.toString.call(data);

/**
 * 根据object的key获取其对应的值
 * @param data
 * @param keys
 * @returns {(*)[]}
 */
const handleObject = (data, keys) => {
	if (!Array.isArray(keys) || !keys.length) {
		handleError(ERROR_TEXT.paramMissed);
	}
	return Object.entries(data)
		.map(([key, value]) => {
			if (keys.findIndex(k => k === key) > -1) {
				return value;
			}
			return undefined;
		})
		.filter(v => v);
};

/**
 *
 * @param data
 * @returns {{method: *}}
 */
const handleAttrs = data => {
	let result = {};
	if (handleESType(data) === '[object object]') {
		Object.entries(data).forEach(([method, value]) => {
			result = {
				...value,
				method,
			};
		});
	}
	return result;
};

const handleTab = (code, tab, tabSize = 2) => {
	const oneTab = Array(tabSize)
		.fill(' ')
		.join('');
	return (
		Array(tab)
			.fill(oneTab)
			.join('') + code
	);
};

/**
 * 格式化代碼
 * @param strings
 * @param tabSize
 * @returns {*}
 */
const handleFormat = (strings, tabSize = 2) => {
	let tab = 0;
	return strings
		.map(line => {
			if (typeof line === 'string' && line.trim().startsWith('}')) {
				tab -= 1;
			}
			const code = handleTab(line, tab, tabSize);
			if (typeof line === 'string' && line.endsWith('{')) {
				tab += 1;
			}
			return code;
		})
		.join('\n');
};

module.exports = {
	handleObject,
	handleAttrs,
	handleFormat,
};
