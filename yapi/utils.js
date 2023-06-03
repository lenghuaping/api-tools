const {exec} = require('child_process');
const iconv = require('iconv-lite');

/**
 * 路径参数处理
 * @param {string} path
 * @return {Array}
 */
// 传入  /loadrateDetail/loadrateDetailId/{mpsRecordId}/{weekIndex}/{workcenterName} 
// 输出 [ 'mpsRecordId', 'weekIndex', 'workcenterName' ]
const normalPath = (path) => {
	return path.match(/[^{]+(?=})/g);
}

/**
 * 判断一个json对象是否为空，即{}
 * @param {JSON} json 传入的json
 * @returns {boolean}
 */
const isEmptyJSON = (json) => {
	let isEmpty = true;
	for (const prop in json) {
		isEmpty = false;
		break;
	}
	return isEmpty;
}

/**
 * 处理以必须参数的数组生成的注释
 * @param {object} data
 * @param {array} required
 * @return {string}
 */
const normalRequiredArray = (data, required) => {
	const commentLines = Object.keys(data).map((d) => {
		const {type, description} = data[d];
		let line = ` * @param {${type}} ${d} ${description || ""} `;
		if (Array.isArray(required) && required.includes(d)) {
			line += '必须 \n'
		} else {
			line += '非必须\n'
		}
		return line;
	});
	return commentLines.join("");
}

/**
 * 将结果复制到剪贴板
 * @param {string} str
 */
const clipStr = (str) => {
	const result = exec('clip').stdin.end(iconv.encode(str, "gbk"));
	return result;
}


module.exports = {
	normalPath,
	isEmptyJSON,
	normalRequiredArray,
	clipStr,
}
 