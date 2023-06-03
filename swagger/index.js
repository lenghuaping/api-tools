// /subtask/report/export
// yarn swaggerType path=subtask/report/export type=add dir=erp/testManage/testDir
// yarn swaggerType module=CompleteInspectionProductController dir=erp/testManage/testDir
// /CompleteInspectionProductController/addCompleteInspectionProduct
const fs = require('fs');
const {request} = require('./config/request');
const {handleCommand} = require('./config/function');
const {handleObject, handleFormat} = require('./solve/config');
const {handleService} = require('./solve/function');
const {handleInterface} = require('./solve/interface');
const {ERROR_TEXT, defaultService} = require('./config/config');

const argvConfig = handleCommand();

if (!argvConfig) return;
if (argvConfig.path) {
	const {path, dir, type, system} = argvConfig;
	const dirPath = `./src/pages/${dir}`;
	request(system).then(async res => {
		const {paths, definitions} = res;
		const generate = handleObject(paths, [`/${path}`]);
		const dataExist = Array.isArray(generate) && generate.length;
		if (dataExist) {
			const data = {
				...generate[0],
				path: `/${path}`,
				type,
				system,
			};
			const serviceFunc = handleService(data);
			const interfaces = handleInterface(data, definitions);
			const serviceStrings = [];
			// const prettierUrl = dirPath.replace(/\\/g, '/')
			if (!fs.existsSync(dirPath)) {
				serviceStrings.push(...defaultService);
				fs.mkdirSync(dirPath, {recursive: true});
			}
			serviceStrings.push(...serviceFunc);
			await fs.writeFile(
				`${dirPath}/service.ts`,
				handleFormat(serviceStrings),
				{flag: 'a'},
				writeError => {
					if (writeError) {
						console.info(writeError.message);
						return;
					}
					console.log(`数据已被追加到文件-${dirPath}/service.ts`);
				}
			);

			await fs.writeFile(
				`${dirPath}/interface.ts`,
				handleFormat(interfaces),
				{flag: 'a'},
				writeError => {
					if (writeError) {
						console.info(writeError.message);
						return
					}
					console.log(`数据已被追加到文件-${dirPath}/interface.ts`);
				}
			);
		}
	});
} else if (argvConfig.module) {
	const {dir, module, system} = argvConfig;
	const dirPath = `./src/pages/${dir}`;
	request(system).then(async res => {
		const {paths, definitions} = res;
		const pathList = [];
		Object.keys(paths).forEach(key => {
			if (key.includes(module)) {
				pathList.push({
					...paths[key],
					path: key,
					type: '',
					system,
				})
			}
		});
		const moduleServices = [];
		const moduleInterface = [];
		const dataExist = pathList.length;
		if (dataExist) {
			// eslint-disable-next-line no-restricted-syntax
			for (const l of pathList) {
				// const data = handleObject(l, [l.path]);
				const serviceFunc = handleService(l);
				const interfaces = handleInterface(l, definitions);
				moduleServices.push(...serviceFunc);
				moduleInterface.push(...interfaces)
			}
			const serviceResult = [];
			serviceResult.push(...defaultService);
			fs.mkdirSync(dirPath, {recursive: true});
			const fileInterfaces = [];
			moduleServices.forEach(l => {
				if (typeof l === 'string' && l.includes('./interface')) {
					// const address = 'import { c } from \'./interface\''
					const inter = l.substring(l.indexOf('{') + 1, l.indexOf('}'))
					fileInterfaces.push(inter);
				}
			})
			const interImport = `import { ${fileInterfaces.map(i => i.trim()).join(', ')} } from './interface'\n`;
			const newMS = moduleServices.filter(s => s.indexOf('./interface') === -1)
			serviceResult.push(interImport, ...newMS);
			fs.writeFile(
				`${dirPath}/service.ts`,
				handleFormat(serviceResult),
				{flag: 'a'},
				writeError => {
					if (writeError) {
						console.info(writeError.message);
						return;
					}
					console.log(`数据已被追加到文件-${dirPath}/service.ts`);
				}
			);

			fs.writeFile(
				`${dirPath}/interface.ts`,
				handleFormat(moduleInterface),
				{flag: 'a'},
				writeError => {
					if (writeError) {
						console.info(writeError.message);
						return
					}
					console.log(`数据已被追加到文件-${dirPath}/interface.ts`);
				}
			);
		}
	});
} else {
	console.info('未知错误');
	process.stdout.write(ERROR_TEXT.unknown);
	process.exit(0);
}
