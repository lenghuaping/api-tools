// 避免模板字符串嵌套
const TEMP = {
	// 模板标识左侧  ${
	TEMP_LEFT: '${',
	// 模板标识右侧  }
	TEMP_RIGHT: '}',
	// 模板字符串的符号
	TEMP_SYMBOL: '`',
};

const ERROR_TEXT = {
	unknown: '未知错误',
	paramMissed: '参数缺失',
};

const PC_PORT = 101;

const URL_HOST = '192.168.0.1';

const URL_MAP = {
	// pc
	pc: {
		host: URL_HOST,
		port: PC_PORT,
		url: `http://${URL_HOST}:${PC_PORT}/v2/api-docs`,
	},
};

const defaultService = [
	"import { makeQueryString } from '@/utils/utils';",
	"import request from '@/utils/request';",
	'// eslint-disable-next-line import/no-unresolved',
	"import config from '@config/domain';\n",
];

module.exports = {
	URL_MAP,
	TEMP,
	ERROR_TEXT,
	defaultService,
};
