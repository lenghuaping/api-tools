const baseType = {
	integer: 'number',
	file: 'any',
	boolean: 'boolean',
	string: 'string',
	object: 'object',
	number: 'number',
};

const mockJson = {
	required: ['code', 'success'],
	properties: {
		code: {
			type: 'integer',
		},
		success: {
			type: 'boolean'
		},
		data: {
			properties: {
				data: {
					items: {
						id: {
							type: 'number',
						},
						name: {
							type: 'string'
						}
					}
				},
				type: 'object'
			},
			required: [''],
			type: 'array'
		}
	},
	type: 'object'
}


const result = {}

const normalResJson = (data) => {
	const {required, type, properties} = data;
	if (type === 'object') {
		Object.entries(properties).forEach(([key, value]) => {
			if (value.type !== 'object' && value.type !== 'array') {
				if (result.children) {
					result.children.push({
						required: required.includes(key) ? "1" : "0",
						name: key,
						desc: ""
					})
				} else {
					result.children = [{
						required: required.includes(key) ? "1" : "0",
						name: key,
						desc: ""
					}]
				}
			} else {
				normalResJson(value)
			}
		})
	} else if (type === 'array') {

	} else {

	}
}

normalResJson(mockJson)

console.log(result, 'result')