const withTab = (code, tab, tabSize = 2) => {
	const oneTab = Array(tabSize)
		.fill(' ')
		.join('');
	return (
		Array(tab)
			.fill(oneTab)
			.join('') + code
	);
};

const formatCode = (strings, tabSize = 2) => {
	let tab = 0;
	return strings
		.map(line => {
			if (typeof line === 'string' && line.trim().startsWith('}')) {
				tab -= 1;
			}
			const code = withTab(line, tab, tabSize);
			if (typeof line === 'string' && line.endsWith('{')) {
				tab += 1;
			}
			return code;
		})
		.join('\n');
};

module.exports = {
	formatCode,
};
