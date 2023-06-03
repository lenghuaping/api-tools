const utils = require("./utils");

/**
 * query参数处理，生成注释的参数解释
 * @param {Array} query
 */
const normalReqQuery = (query) => {
	const commentQueryHeader = query && query.length > 0 ? ` * Query参数\n` : "";
	const queryLine = query.map((q) => {
		const qr = q.required;
		const isRequierd = qr === 1 ? " 必须" : " 非必须";
		const qn = q.name;
		const qe = q.example ? ` ${q.example} ` : '';
		const qd = q.example ? ` ${q.desc}` : '';
		return ` * @param{String} params.${qn} ${qd} ${qe}${isRequierd}\n`;
	});
	return commentQueryHeader + queryLine.join("");
}

/**
 * 路径参数形成注释
 * @param {string} path
 */
const normalPathParam = (path) => {
	const pathParam = utils.normalPath(path);
	const commentPathHeader = pathParam && pathParam.length > 0 ? ` * 路径参数\n` : "";
	const commentLines = pathParam ? pathParam.map((p) => {
		const line = ` * @param {string} params.${p} \n`;
		return line
	}) : [];
	return commentPathHeader + commentLines.join("");
}

/**
 * Body参数转为注释内容
 * @param {JSON} body
 */
const normalBodyData = (body) => {
	const bodyObj = JSON.parse(body);
	const {properties, required} = bodyObj;
	const isEmpty = utils.isEmptyJSON(body)
	if (utils.isEmptyJSON(properties)) {
		return "";
	}
	const commentBodyHeader = !isEmpty ? ` * Body参数\n` : "";
	const commentBodyParams = utils.normalRequiredArray(properties, required);
	return commentBodyHeader + commentBodyParams;
}

/**
 * 返回数据转为注释内容
 * @param {JSON} reponse
 */
const normalReponse = (reponse) => {
	const resObj = JSON.parse(reponse);
	const {properties, required} = resObj;
	const isEmpty = utils.isEmptyJSON(reponse);
	if (utils.isEmptyJSON(properties) || !required || required.length <= 0) {
		return "";
	}
	const data = properties['data'] || {};
	const commentResHeader = !isEmpty ? ` * 返回数据\n` : "";
	const dataProperty = data.properties;
	const dataRequired = data.required;
	const commentData = utils.normalRequiredArray(dataProperty, dataRequired);
	return commentResHeader + commentData;
}

module.exports = {
	normalReqQuery,
	normalPathParam,
	normalBodyData,
	normalReponse,
};
