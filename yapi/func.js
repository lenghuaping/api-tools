const utils = require("./utils");

/**
 * 根据路径生成函数名
 * @param {string} path 路径
 */
const generatorFuncName = (path) => {
	const pathArr = path.split("/");
	const length = pathArr.length;
	if (length >= 4) {
		const funcName = pathArr.join("").split("{")[0];
		return funcName;
	} else {
		return "funcName";
	}
}

/**
 * 处理请求方法
 * @param {string} method 请求方法
 * @param {string} body 请求的body参数
 */
function normalMethod(method, body) {
	// GET请求不需要传请求方法、body参数
	if (method === "GET") return "";
	const lineMethod = `   method: '${method}',\n`;
	const lineBody = body ? `   body: params,\n` : "";
	return lineMethod + lineBody;
}

// 避免模板字符串嵌套 
// 模板标识左侧  ${
const tempLeft = "${";
// 模板标识右侧  }
const tempRight = "}";
// 模板字符串的符号
const tempSymbol = "`";

/**
 *
 * @param {string} method 请求方法
 * @param {string} path 请求路径
 * @param {array} req_query 请求参数，？之后的
 * @param {object} req_body_other 请求的 body 参数。
 */
const normalFunc = (method, path, req_query, req_body_other) => {
	// 是否有？之后的参数
	const isReqQuery = req_query && req_query.length > 0;
	// 函数名，暂定为路径最后一个 / 之后的字符串
	// const splitPath = path.split("/");
	const funcName = generatorFuncName(path);
	// 函数定义行
	const funcHeader = req_query ? `export async function ${funcName}(params) {\n` :
		`export async function funcName'()' '{'\n`;
	// 获取路径中的路径参数
	const pathParams = utils.normalPath(path);
	// 转成请求中的路径参数 形式
	const newPathParams = pathParams ? pathParams.map((p) => {
		return `${tempLeft}params.${p}${tempRight}`;
	}).join("/") : "";
	// omit函数需要的路径参数
	const omitParams = pathParams ? pathParams.map((p) => {
		return `'${p}'`
	}) : "";
	const methodLine = normalMethod(method, req_body_other);
	// 带路径参数的路径
	const newPath = path.split("{")[0] + newPathParams;
	// 移除了路径参数之后的query参数
	const funcQuery = pathParams && isReqQuery ? ` const query = _.omit(params, [${omitParams.toString()}]);\n` : "";
	const isQuery = funcQuery ? "query" : "params";
	// return的 ？之前部分
	const returnHeader = ` return request(${tempSymbol}${tempLeft}config.MPS_URL${tempRight}${newPath}`;
	// return的 ？之后部分
	const returnFooter = isReqQuery ? `?${tempLeft}stringify(${isQuery})${tempRight}${tempSymbol}` : "`";
	// return 的内容
	const funcContent = !methodLine ? returnHeader + returnFooter + ");\n" :
		returnHeader + returnFooter + ", {\n";
	// 函数体最后的闭合括号
	const contentFooter = !methodLine ? "" : " });\n";
	const funcFooter = "}\n";
	return funcHeader + funcQuery + funcContent + methodLine + contentFooter + funcFooter;
}

module.exports = {
	normalFunc,
}
