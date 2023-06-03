const {ERROR_TEXT} = require('./config');

/**
 * 处理错误
 * @param error
 */
const handleError = error => {
	if (typeof error === 'string') {
		console.error(error);
		throw new Error(error);
	} else {
		console.error(`${error.name}:${error.message}`);
		throw new Error(error.message);
	}
};

const handleParam = param => {
	const index = process.argv.findIndex(c => c.startsWith(param));
	if (index < 0 || !param) {
		// handleError(`${param}：${ERROR_TEXT.paramMissed}`);
		return ''
	}
	return process.argv[index].split('=')[1];
};

/**
 * path: 接口路径
 * dir: 生成路径
 * type: 接口类型 (add、edit、delete、list)
 * @returns {string}
 */
const handleCommand = () => {
	// console.info(process.argv);
	const types = ['add', 'edit', 'delete', 'list'];
	const path = handleParam('path');
	const dir = handleParam('dir');
	const type = handleParam('type');
	const system = handleParam('system');
	if (types.includes(type)) {
		return {
			path,
			dir,
			type,
			system,
		};
	}
	return {
		path,
		dir,
		module: type,
		system,
	};
};

module.exports = {
	handleError,
	handleCommand,
	handleParam,
};
