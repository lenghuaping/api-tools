const {TEMP} = require('../config/config');
const {handleComment} = require('./comment');

const methods = ['get', 'post', 'delete', 'put', 'patch'];
// const types = ['add', 'edit', 'delete', 'list'];

const urlMap = {
	mes: 'MES_URL',
	mesAPP: 'MES_URL',
	// 看板
	mesBoard: 'MES_URL',
	// 平板app
	mesOpera: 'MES_URL',
	erpAPP: 'MPS_URL',
	erpBoard: 'MPS_URL',
	erpOpera: 'MPS_URL',
	role: 'ROLE_URL',
	aps: 'APS_URL',
	basic: 'BASIC_DATA',
	apqp: 'APQP_URL',
	ork: 'OKR_URL',
	erp: 'MPS_URL',
};

const upperFirst = text => text.replace(/^\S/, s => s.toUpperCase());
const lowerFirst = text => text.replace(/^\S/, s => s.toLowerCase());

const handlePath = value => {
	const keys = Object.keys(value);
	if (Array.isArray(keys) && keys.length === 4 && methods.includes(keys[0])) {
		const index = keys.findIndex(k => keys.includes(k));
		if (index > -1) {
			return {
				...value[keys[index]],
				method: keys[index].toLocaleUpperCase(),
				path: value[keys[1 - index]],
				type: value.type,
				system: value.system,
			};
		}
		return null;
	}
	return null;
};

/**
 * 方法名
 * @param path
 * @returns {*}
 */
const handleFuncName = path =>
	path
		.split('/')
		.filter(x => x)
		.map((c, i) => (i > 0 ? upperFirst(c) : lowerFirst(c)))
		.join('');

/**
 * 生成service方法
 * @param data
 * @returns {[]}
 */
const handleService = data => {
	const strings = [];
	const refactored = handlePath(data);
	if (refactored !== null) {
		const {path, method, parameters, system} = refactored;
		if (!system) {
			console.info('沒有系統參數');
		}
		const systemUrl = urlMap[system];
		const funcName = handleFuncName(path); // service方法名
		const pathArr = path.split('/');
		const pathLen = pathArr.length;
		const interfaceName = `I${upperFirst(pathArr[pathLen - 1])}${upperFirst(pathArr[pathLen - 2])}`;
		// 参数如果不是数组就需要在defines里面找
		const hasParams = Array.isArray(parameters);
		// 根据是否有参数生成不同的方法首行
		const paramStr = hasParams ? `(params: ${interfaceName})` : '()';

		if (hasParams) {
			strings.push(`import { ${interfaceName} } from './interface';\n`);
		}
		const comments = handleComment(refactored); // service方法注釋
		strings.push(...comments);

		strings.push(`export async function ${funcName}${paramStr} {`);

		// get方法
		if (method === 'GET') {
			const stringifyStr = hasParams ? `?${TEMP.TEMP_LEFT}makeQueryString(params)${TEMP.TEMP_RIGHT}` : '';
			strings.push(
				`return request(${TEMP.TEMP_SYMBOL}${TEMP.TEMP_LEFT}config.${systemUrl}${TEMP.TEMP_RIGHT}${path}${stringifyStr}${TEMP.TEMP_SYMBOL})`
			);
		} else {
			strings.push(
				`return request(${TEMP.TEMP_SYMBOL}${TEMP.TEMP_LEFT}config.${systemUrl}${TEMP.TEMP_RIGHT}${path}${TEMP.TEMP_SYMBOL}, { method: '${method}', data: params })`
			);
		}
		strings.push('}\n');
	}
	return strings;
};

module.exports = {
	handlePath,
	handleService,
};
