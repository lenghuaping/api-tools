const handleComment = data => {
	const {description, type, summary} = data;
	const strings = ['/**'];
	if (type) {
		strings.push(`* @type ${type}`);
	}
	if (description) {
		strings.push(`* @description ${description}`);
	}
	if (summary) {
		strings.push(`* @summary ${summary}`);
	}
	if (!summary && !description && !type) {
		return [];
	}
	strings.push('*/');
	return strings;
};

module.exports = {
	handleComment,
};
