const {getDataType, getRef} = require('./dataType');
const {handlePath} = require('./function');
const {handleError} = require('../config/function');

const upperFirst = text => text.replace(/^\S/, s => s.toUpperCase());

/**
 * 是否必须
 * @param flag
 * @returns {string}
 */
const required = flag => {
	if (flag) return '';
	return '?';
};

const handleBasic = path => {
	if (typeof path === 'string' && path.includes('/')) {
		// const strings = path.split('/');
		// const [space, moduleName, pathName, lastPath, ...restStrs] = strings;
		// return `${moduleName}${pathName}${lastPath}`;
		const pathArr = path.split('/');
		const pathLen = pathArr.length;
		const interfaceName = `I${upperFirst(pathArr[pathLen - 1])}${upperFirst(pathArr[pathLen - 2])}`;
		return interfaceName;
	}
	return 'InterfaceName';
};

/**
 *
 * @param data
 * @returns {{path: [], formData: [], params: []}}
 */
const handleGroup = data => {
	const p = {
		path: [],
		params: [],
		formData: [],
	};
	if (Array.isArray(data)) {
		data.forEach(parameter => {
			// eslint-disable-next-line default-case
			switch (parameter.in) {
				case 'path':
					p.path.push(parameter);
					break;
				case 'query':
					p.params.push(parameter);
					break;
				case 'body':
					p.data = parameter;
					break;
				case 'formData':
					p.formData.push(parameter);
			}
		});
		if (p.path.length === 0) delete p.path;
		if (p.params.length === 0) delete p.params;
		if (p.formData.length === 0) delete p.formData;
	}
	return p;
};

/**
 *
 * @param parameters
 * @param defines
 * @returns {{}}
 */
const handlePerameter = (parameters, defines) => {
	const result = {};
	if (Array.isArray(parameters)) {
		Object.entries(defines).forEach(([def, value]) => {
			const exist =
				parameters.findIndex(l => {
					const {schema} = l;
					if (schema && schema.$ref) {
						return schema.$ref.includes(def);
					}
					return false;
				}) > -1;
			if (exist) {
				result[def] = value;
			}
		});
	}
	return result;
};

const handleChild = (relations, defines) => {
	const childDefs = {};
	const refs = [];
	relations.forEach(r => {
		const {childRef} = r;
		if (Array.isArray(childRef) && childRef.length) {
			childRef.forEach(c => {
				refs.push(c.ref);
			});
		}
	});
	Object.entries(defines).forEach(([k, v]) => {
		const index = refs.findIndex(r => r === k);
		if (index > -1) {
			childDefs[k] = v;
		}
	});
	return childDefs;
}

const handleDefines = (data, definitions) => {
	const lines = [];
	// const isRelationsExist = Array.isArray(relations) && relations.length;
	Object.entries(definitions).forEach(([key, definition]) => {
		// const index = isRelationsExist
		//   ? relations.findIndex(r => r.configName === getVariable(key))
		//   : -1;
		// const realInterfaceName = index > -1 ? relations[index].actualName : getVariable(key);
		const interfaceName = handleBasic(data.path)
		lines.push(`// namesConfig ${interfaceName} - ${interfaceName} _FLAG namesConfig`);
		lines.push(`export interface ${interfaceName} {`);
		// eslint-disable-next-line no-unused-expressions
		definition.properties &&
		Object.entries(definition.properties).forEach(([subKey, property]) => {
			if (property.description && property.description !== subKey) {
				lines.push(`/** ${property.description} */`);
			}
			const isRequired = definition.required && definition.required.includes(subKey) ? '' : '?';
			lines.push(`${subKey}${isRequired}: ${getDataType(property)};`);
		});
		lines.push('}\n');
	});
	return lines;
};

const handleRelation = (data, defins) => {
	const {path, parameters} = data;
	const list = [];
	const hasParams = Array.isArray(parameters) && parameters.length;
	if (hasParams) {
		parameters.forEach(p => {
			const itemRef = {path, childRef: []};
			const {schema} = p;
			if (schema && schema.$ref) {
				const ref = getRef(schema.$ref);
				itemRef.currentRef = ref;
				if (defins[ref]) {
					const {properties} = defins[ref];
					Object.entries(properties).forEach(([key, values]) => {
						if (values.$ref) {
							itemRef.childRef.push({ref: getRef(values.$ref)});
						}
						if (values.items && values.items.$ref) {
							itemRef.childRef.push({ref: getRef(values.items.$ref)});
						}
					});
				}
				list.push(itemRef);
			}
		});
	}
	return list;
};

const handleKey = key => {
	if (typeof key === 'string') {
		return key.includes('.') ? `'${key}'` : key;
	}
	handleError('返回数据异常');
	return null;
};

const getDesc = desc => {
	return desc ? `// ${desc}` : '';
};

/**
 * 生成接口的内容
 * @param parameters
 * @param interfaceName
 * @returns {[string, string, ...*, string]|*[]}
 */
const handleContent = (parameters, interfaceName) => {
	if (Array.isArray(parameters) && parameters.length) {
		return [
			`// namesConfig ${interfaceName} - ${interfaceName} _FLAG namesConfig`,
			`export interface ${interfaceName} {`,
			...parameters.map(
				parameter =>
					`${handleKey(parameter.name)}${required(parameter.required)}: ${getDataType(
						parameter
					)}; ${getDesc(parameter.description)}`
			),
			'}\n',
		];
	}
	return [];
}

const handleInterface = (source, defines) => {
	const strings = [];

	const data = handlePath(source);
	const {parameters} = data;

	const grouped = handleGroup(parameters);
	const relations = handleRelation(data, defines);
	const defs = handlePerameter(parameters, defines);
	const childDefs = relations.length ? handleChild(relations, defines) : {};

	// console.info(data)

	if (defines) {
		strings.push(...handleDefines(data, {...defs, ...childDefs}));
	}

	Object.entries(grouped).forEach(([paramName, param]) => {
		const interfaceName = handleBasic(data.path);
		if (paramName === 'data') return;
		strings.push(...handleContent(param, interfaceName));
	});


	// const paramInterface = handlePerameter(parameters);
	// const definesInterface = handleDefines(defines);
	// return [...paramInterface, ...definesInterface]
	return strings;
};

module.exports = {
	handleInterface,
};
