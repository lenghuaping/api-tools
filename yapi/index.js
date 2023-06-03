const process = require('process')
const http = require('http')
const fs = require('fs')
const util = require('util');

const comment = require("./comment");
const utils = require("./utils");
const func = require("./func");

// 路径参数指 用/连接，在？之前的参数
// query参数指 ？之后的参数

function outFile(data) {
	// query参数在req_query中，body参数在req_body_other,返回的数据格式res_body
	const {
		method,
		title,
		path,
		res_body,
		req_query,
		req_body_other,
	} = data;

	let str = '';
	const commentHeader = '/**\n';
	const commentFooter = '*/\n';
	const commentTitle = ' * ' + title + '\n';
	// 注释中的路径参数
	const commentPath = comment.normalPathParam(path);
	// 注释中的 query参数
	const commentQuery = req_query ? comment.normalReqQuery(req_query) : "";
	// 注释中的 body参数
	const commentReqBody = req_body_other ? comment.normalBodyData(req_body_other) : "";
	const commentReponse = res_body ? comment.normalReponse(res_body) : "";
	// 函数体内容
	const funcBody = func.normalFunc(method, path, req_query, req_body_other);
	str += commentHeader + commentTitle + commentQuery + commentReqBody + commentPath + commentReponse + commentFooter + funcBody;
	console.info(str);

// /**
//  * 获取****列表
//  * @param {number} params.currentPage - 当前页
//  * @param {number} params.pageSize - 每页数量
//  */
// export async function getPullDemandDetail(params) {
//   const query = _.omit(params, ['currentPage', 'pageSize', 'id']);
//   return request(`${config.MPS_URL}/purchaseRecord/getDemandPullPlanDelivery/${params.id}/${params.currentPage}/${params.pageSize}?${stringify(query)}`)
// }
	// exec('clip').stdin.end(iconv.encode(str, "gbk"));
	utils.clipStr(str);
}


/**
 * 处理Body参数
 * @param {Json} body
 */
// function normalReqBody(body) {
//   // JSOn 转为对象
//   const bodyObject = JSON.parse(body);
//   // 其中的参数
//   const requiredParams = bodyObject.required;
//   const bodyParams = bodyObject.properties;

//   Object.keys(bodyParams).forEach((bpk, bpi) => {
//     // 参数名称
//     const bpn = bpk;
//     const bpd = bodyParams.bpk;
//     const bpt = bodyParams.bpk;
//     console.info(bpk);
//   });
// }


function request(id) {
	var data = {email: "110110110@qq.com", password: "********"};
	data = JSON.stringify(data);

	var apiOpt = {
		host: '192.168.0.1',
		port: '3000',   // path为域名时，不加port
		method: 'GET',
		path: 'http://192.168.0.1:3000/api/interface/get?id=' + id,
		headers: {
			"Content-Type": 'application/json',
		}
	}
	var opt = {
		host: '192.168.0.1',
		port: '3000',   // path为域名时，不加port
		method: 'POST',
		path: 'http://192.168.0.1:3000/api/user/login',
		headers: {
			"Content-Type": 'application/json',
		}
	}

	var body = '';
	var req = http.request(opt, function (res) {
		const {headers} = res
		const cookie = headers['set-cookie'][0]
		const token = cookie.split(';')[0]
		let uid = '_yapi_uid='
		res.on('data', function (data) {
			body += data;
		}).on('end', function () {
			const resBody = JSON.parse(body)
			uid += resBody.data.uid
			apiOpt.headers.Cookie = `${token};${uid}`
			var apiBody = ''
			var nextReq = http.request(apiOpt, function (apiRes) {
				apiRes.on('data', function (data) {
					apiBody += data
				}).on('end', function () {
					apiBody = JSON.parse(apiBody);
					if (apiBody.data) {
						outFile(apiBody.data)
					} else {
						process.stdout.write("此接口未定义,请重新输入: \n");
					}
				}).on('error', function (error) {
					console.log(error.message)
				})
			})
			nextReq.write('')
			nextReq.end()
		});
	}).on('error', function (e) {
		console.log("error: " + e.message);
	})
	req.write(data);
	req.end();
}

process.on('exit', function (code) {
	console.log(code)
});
process.stdin.setEncoding('utf8');
// request(8257); // 路径参数
// request(8167); // body 参数
// request(7627); // 路径参数
// request(8164); // 返回数据 路径参数
// request(8170); // 返回数据 路径参数
// request(8173); // body 参数 

process.stdout.write("自动化生成接口\n");
process.stdout.write("请输入yapi接口id：");
process.stdin.on('data', (input) => {
	input = input.toString().trim();
	const reg = /^[+]{0,1}(\d+)$/
	if (reg.test(input)) {
		request(input)
	} else {
		process.stdout.write('请输入数字')
		process.exit(0)
	}
})
 