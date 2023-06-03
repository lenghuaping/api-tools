const getVariable = name => {
	if (typeof name === 'string') {
		return name.replace(/[^\w]/g, '');
	}
	return '';
};

const getRef = ref => getVariable(ref.replace(/^.*\/([^/]*)$/, '$1'));

const getEnums = enums =>
	`(${enums.map(item => (typeof item === 'string' ? `'${item}'` : item)).join('|')})`;

const getDataType = property => {
	const baseType = {
		integer: 'number',
		file: 'any',
		boolean: 'boolean',
		string: 'string',
		object: 'object',
		number: 'number',
	};
	if (property.$ref) {
		return getRef(property.$ref);
	}
	if (property.items) {
		return `Array<${getDataType(property.items)}>`;
	}
	if (property.enum) {
		return getEnums(property.enum);
	}
	if (property.type) {
		return baseType[property.type];
	}
	return 'any';
};

module.exports = {
	getVariable,
	getRef,
	getDataType,
};
